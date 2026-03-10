import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(userId: string, data: {
    orderId: string;
    paymentMethod: string;
  }) {
    // Verify order exists and belongs to the user
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.buyerId !== userId) {
      throw new ForbiddenException('You can only pay for your own orders');
    }

    // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)

    return this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: order.price, // Use order price, not user-supplied amount
        paymentMethod: data.paymentMethod,
        currency: 'USD',
        status: 'pending',
      },
    });
  }

  async getPayment(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.buyerId !== userId && order.boosterId !== userId) {
      throw new ForbiddenException('You can only view payments for your own orders');
    }

    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }

  async updatePaymentStatus(orderId: string, status: string, transactionId?: string) {
    return this.prisma.payment.update({
      where: { orderId },
      data: {
        status,
        ...(transactionId && { transactionId }),
      },
    });
  }
}
