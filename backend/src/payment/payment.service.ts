import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(data: {
    orderId: string;
    amount: number;
    paymentMethod: string;
  }) {
    // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
    
    return this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        currency: 'USD',
        status: 'pending',
      },
    });
  }

  async getPayment(orderId: string) {
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
