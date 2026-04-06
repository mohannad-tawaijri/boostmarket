import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
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

  /** Verify a Moyasar payment by fetching it from Moyasar API */
  async verifyMoyasarPayment(data: {
    paymentId: string;
    orderId?: string;
    status: string;
  }) {
    const secretKey = process.env.MOYASAR_SECRET_KEY;
    if (!secretKey) {
      this.logger.error('MOYASAR_SECRET_KEY not configured');
      throw new BadRequestException('Payment gateway not configured');
    }

    // Fetch payment details from Moyasar to confirm status
    const response = await fetch(
      `${this.moyasarBaseUrl}/payments/${data.paymentId}`,
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

    const payment: MoyasarPayment = await response.json();
    this.logger.log(
      `Moyasar payment ${payment.id} status: ${payment.status}`,
    );

    // Resolve orderId from payment metadata or the passed orderId
    const orderId =
      data.orderId || payment.metadata?.order_id;

    if (orderId) {
      // Update payment record in DB
      const existingPayment = await this.prisma.payment.findFirst({
        where: { orderId },
      });

      if (existingPayment) {
        await this.prisma.payment.update({
          where: { orderId },
          data: {
            status: payment.status,
            transactionId: payment.id,
          },
        });
      } else {
        // Create if doesn't exist (e.g. direct Moyasar flow)
        await this.prisma.payment.create({
          data: {
            orderId,
            amount: payment.amount / 100, // Moyasar stores in halalas
            currency: payment.currency,
            paymentMethod: payment.source?.type || 'creditcard',
            transactionId: payment.id,
            status: payment.status,
          },
        });
      }

      // Update order status if paid
      if (payment.status === 'paid' || payment.status === 'authorized') {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'IN_PROGRESS' },
        });
      }
    }

    return {
      id: payment.id,
      status: payment.status,
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
    if (webhookSecret && payload.secret_token !== webhookSecret) {
      this.logger.warn('Webhook secret mismatch — ignoring');
      throw new ForbiddenException('Invalid webhook secret');
    }

    if (payload.type === 'payment_paid' || payload.type === 'payment_failed') {
      const payment = payload.data;
      const orderId = payment.metadata?.order_id;

      this.logger.log(
        `Webhook: payment ${payment.id} ${payment.status}${orderId ? ` for order ${orderId}` : ''}`,
      );

      if (orderId) {
        await this.prisma.payment.updateMany({
          where: { orderId },
          data: { status: payment.status, transactionId: payment.id },
        });

        if (payment.status === 'paid' || payment.status === 'authorized') {
          await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'IN_PROGRESS' },
          });
        }
      }
    }

    return { received: true };
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
