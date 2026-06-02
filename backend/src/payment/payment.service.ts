import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

interface MoyasarPayment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  amount_format: string;
  fee: number;
  fee_format: string;
  refunded: number;
  refunded_format: string;
  captured: number;
  captured_format: string;
  voided_at: string | null;
  captured_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, string> | null;
  source: {
    type: string;
    company: string;
    name: string;
    number: string;
    message: string | null;
    transaction_url: string | null;
  };
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly moyasarBaseUrl = 'https://api.moyasar.com/v1';

  constructor(private prisma: PrismaService) {}

  /** Initiate a payment record (before user pays) */
  async createPayment(
    userId: string,
    data: { orderId: string; paymentMethod: string },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId)
      throw new ForbiddenException('You can only pay for your own orders');

    return this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: order.price,
        paymentMethod: data.paymentMethod,
        currency: 'SAR',
        status: 'pending',
      },
    });
  }

  /**
   * Create a Moyasar charge server-side from a single-use card token.
   *
   * The card PAN/CVC are tokenized in the browser with the *publishable* key and
   * never reach our server. Crucially, the charged amount and the order metadata
   * are set here from the order in our DB — never from the client — so a tampered
   * request can't underpay or attach the payment to a different order.
   */
  async createCharge(userId: string, data: { orderId: string; token: string }) {
    if (!data?.orderId || !data?.token) {
      throw new BadRequestException('orderId and token are required');
    }

    // Token payments must be authenticated with the *publishable* key — Moyasar
    // scopes a token to the key that created it (the frontend's publishable key),
    // so charging it with the secret key is rejected as "token is invalid".
    const publishableKey = process.env.MOYASAR_PUBLISHABLE_KEY;
    if (!publishableKey) {
      this.logger.error('MOYASAR_PUBLISHABLE_KEY not configured');
      throw new BadRequestException('Payment gateway not configured');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        payment: true,
        service: { select: { title: true, game: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId) {
      throw new ForbiddenException('You can only pay for your own orders');
    }

    // Don't allow re-charging an order that is already paid / in progress.
    const alreadySettled =
      order.payment?.status === 'paid' ||
      order.payment?.status === 'authorized' ||
      order.status === 'IN_PROGRESS' ||
      order.status === 'COMPLETED';
    if (alreadySettled) {
      throw new BadRequestException('This order has already been paid');
    }

    const frontendUrl = (
      process.env.FRONTEND_URL || 'https://boostmarket.app'
    ).replace(/\/$/, '');
    // Callback is built server-side (not taken from the client) to avoid an
    // open-redirect through the payment gateway.
    const callbackUrl = `${frontendUrl}/payment/callback?orderId=${order.id}`;

    const amount = Math.round(order.price * 100); // halalas, from the DB
    const description = order.service
      ? `${order.service.title} - ${order.service.game}`
      : `Order ${order.id}`;

    const response = await fetch(`${this.moyasarBaseUrl}/payments`, {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${publishableKey}:`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'SAR',
        description,
        callback_url: callbackUrl,
        metadata: { order_id: order.id },
        source: { type: 'token', token: data.token },
      }),
    });

    const payment: any = await response.json();
    if (!response.ok) {
      this.logger.error(
        `Moyasar create payment error: ${response.status} ${JSON.stringify(payment)}`,
      );
      const message =
        payment?.message ||
        (Array.isArray(payment?.errors) ? payment.errors.join(', ') : null) ||
        'Failed to create payment';
      throw new BadRequestException(
        typeof message === 'string' ? message : 'Failed to create payment',
      );
    }

    // If the gateway settled immediately (no 3DS), reconcile so the amount is
    // validated and the order advanced. Otherwise just record it as initiated.
    if (payment.status === 'paid' || payment.status === 'authorized') {
      await this.reconcilePayment(payment, order);
    } else {
      await this.upsertPaymentRecord(order.id, payment, payment.status || 'initiated');
    }

    return {
      id: payment.id,
      status: payment.status,
      source: { transaction_url: payment.source?.transaction_url ?? null },
    };
  }

  /**
   * Verify a Moyasar payment by fetching it directly from the Moyasar API.
   *
   * Security notes:
   *  - The order is resolved strictly from the gateway's own metadata, never
   *    from a client-supplied orderId. Otherwise a user could pay a tiny amount
   *    for a throwaway order and replay that paymentId to settle an expensive
   *    one.
   *  - The caller must be the buyer of the resolved order.
   *  - The gateway-confirmed amount/currency must match the order total before
   *    the order is advanced (see {@link reconcilePayment}).
   */
  async verifyMoyasarPayment(
    userId: string,
    data: { paymentId: string },
  ) {
    if (!data?.paymentId) {
      throw new BadRequestException('paymentId is required');
    }

    const payment = await this.fetchMoyasarPayment(data.paymentId);
    this.logger.log(`Moyasar payment ${payment.id} status: ${payment.status}`);

    const orderId = payment.metadata?.order_id;
    if (!orderId) {
      throw new BadRequestException('Payment is not linked to an order');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.buyerId !== userId) {
      throw new ForbiddenException(
        'You can only verify payments for your own orders',
      );
    }

    const effectiveStatus = await this.reconcilePayment(payment, order);

    return {
      id: payment.id,
      status: effectiveStatus,
      amount: payment.amount / 100,
      currency: payment.currency,
      description: payment.description,
    };
  }

  /** Handle Moyasar webhook callback */
  async handleWebhook(payload: {
    type: string;
    data: MoyasarPayment;
    secret_token?: string;
  }) {
    const webhookSecret = process.env.MOYASAR_WEBHOOK_SECRET;
    // Fail closed: with no configured secret we cannot authenticate the caller,
    // so reject rather than blindly trusting whoever posted to this endpoint.
    if (!webhookSecret) {
      this.logger.error(
        'MOYASAR_WEBHOOK_SECRET not configured — rejecting webhook',
      );
      throw new ForbiddenException('Webhook not configured');
    }
    if (!this.safeEqual(payload?.secret_token, webhookSecret)) {
      this.logger.warn('Webhook secret mismatch — ignoring');
      throw new ForbiddenException('Invalid webhook secret');
    }

    if (payload.type === 'payment_paid' || payload.type === 'payment_failed') {
      const paymentId = payload.data?.id;
      if (!paymentId) {
        this.logger.warn('Webhook missing payment id — ignoring');
        return { received: true };
      }

      // Never trust the amount/status in the POST body (forgeable if the secret
      // ever leaks). Re-fetch the authoritative payment from Moyasar.
      const payment = await this.fetchMoyasarPayment(paymentId);
      const orderId = payment.metadata?.order_id;
      const order = orderId
        ? await this.prisma.order.findUnique({ where: { id: orderId } })
        : null;

      const status = await this.reconcilePayment(payment, order);
      this.logger.log(`Webhook reconciled payment ${payment.id} -> ${status}`);
    }

    return { received: true };
  }

  /** Fetch a payment object from Moyasar using the server-side secret key. */
  private async fetchMoyasarPayment(paymentId: string): Promise<MoyasarPayment> {
    const secretKey = process.env.MOYASAR_SECRET_KEY;
    if (!secretKey) {
      this.logger.error('MOYASAR_SECRET_KEY not configured');
      throw new BadRequestException('Payment gateway not configured');
    }

    const response = await fetch(
      `${this.moyasarBaseUrl}/payments/${encodeURIComponent(paymentId)}`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Basic ' + Buffer.from(`${secretKey}:`).toString('base64'),
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      this.logger.error(
        `Moyasar API error: ${response.status} ${response.statusText}`,
      );
      throw new BadRequestException('Failed to verify payment with Moyasar');
    }

    return response.json() as Promise<MoyasarPayment>;
  }

  /**
   * Reconcile a Moyasar payment against its order. Persists the payment record
   * and only advances the order when the gateway-confirmed amount and currency
   * match the order total. Returns the *effective* (trusted) status — a settled
   * payment whose amount doesn't match is downgraded to 'failed' so it can never
   * progress the order.
   */
  private async reconcilePayment(
    payment: MoyasarPayment,
    order: { id: string; price: number } | null,
  ): Promise<string> {
    if (!order) {
      this.logger.warn(
        `Payment ${payment.id} references unknown/missing order — skipping`,
      );
      return payment.status;
    }

    const isSettled =
      payment.status === 'paid' || payment.status === 'authorized';
    const expectedAmount = Math.round(order.price * 100); // halalas
    const amountOk = payment.amount === expectedAmount;
    const currencyOk = (payment.currency || '').toUpperCase() === 'SAR';

    let effectiveStatus = payment.status;
    if (isSettled && (!amountOk || !currencyOk)) {
      this.logger.warn(
        `Payment ${payment.id} amount/currency mismatch for order ${order.id}: ` +
          `got ${payment.amount} ${payment.currency}, expected ${expectedAmount} SAR — rejecting`,
      );
      effectiveStatus = 'failed';
    }

    await this.upsertPaymentRecord(order.id, payment, effectiveStatus);

    if (effectiveStatus === 'paid' || effectiveStatus === 'authorized') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return effectiveStatus;
  }

  /** Insert or update the local Payment row for an order. */
  private async upsertPaymentRecord(
    orderId: string,
    payment: MoyasarPayment,
    status: string,
  ) {
    const existing = await this.prisma.payment.findFirst({ where: { orderId } });
    if (existing) {
      await this.prisma.payment.update({
        where: { orderId },
        data: { status, transactionId: payment.id },
      });
    } else {
      await this.prisma.payment.create({
        data: {
          orderId,
          amount: payment.amount / 100, // Moyasar stores in halalas
          currency: payment.currency,
          paymentMethod: payment.source?.type || 'creditcard',
          transactionId: payment.id,
          status,
        },
      });
    }
  }

  /** Constant-time string comparison to avoid timing side channels. */
  private safeEqual(provided: string | undefined, expected: string): boolean {
    if (!provided) return false;
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  async getPayment(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId && order.boosterId !== userId)
      throw new ForbiddenException(
        'You can only view payments for your own orders',
      );

    return this.prisma.payment.findUnique({ where: { orderId } });
  }

  async updatePaymentStatus(
    orderId: string,
    status: string,
    transactionId?: string,
  ) {
    return this.prisma.payment.update({
      where: { orderId },
      data: { status, ...(transactionId && { transactionId }) },
    });
  }
}
