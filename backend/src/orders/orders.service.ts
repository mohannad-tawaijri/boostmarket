import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, data: { serviceId: string; requirements?: any }) {
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.order.create({
      data: {
        serviceId: data.serviceId || undefined,
        buyerId,
        boosterId: service.boosterId,
        price: service.price,
        requirements: data.requirements,
      },
      include: {
        service: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        booster: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, role: 'buyer' | 'booster') {
    const where = role === 'buyer' ? { buyerId: userId } : { boosterId: userId };

    return this.prisma.order.findMany({
      where,
      include: {
        service: true,
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        booster: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        service: true,
        buyer: true,
        booster: true,
        payment: true,
        review: {
          select: { id: true, rating: true, comment: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.buyerId !== userId && order.boosterId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  async updateStatus(id: string, userId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.boosterId !== userId) {
      throw new ForbiddenException('Only the booster can update order status');
    }

    // Block starting work on an unpaid order
    if (status === 'IN_PROGRESS') {
      const paid =
        order.payment?.status === 'paid' ||
        order.payment?.status === 'authorized';
      if (!paid) {
        throw new BadRequestException('Cannot start an unpaid order');
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: status as any,
        ...(status === 'IN_PROGRESS' && { startedAt: new Date() }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { boosterId: userId },
        ],
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            game: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        booster: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
