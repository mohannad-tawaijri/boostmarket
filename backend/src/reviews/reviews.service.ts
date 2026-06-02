import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, data: {
    serviceId: string;
    orderId: string;
    rating: number;
    comment?: string;
  }) {
    // Validate rating — without this a client could submit an out-of-range or
    // non-integer rating and skew the booster's average (e.g. rating: 9999).
    const rating = Number(data.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }
    const comment =
      typeof data.comment === 'string' ? data.comment.slice(0, 1000) : undefined;

    if (!data.orderId || typeof data.orderId !== 'string') {
      throw new BadRequestException('orderId is required');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: { service: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.buyerId !== reviewerId) {
      throw new BadRequestException('You can only review your own orders');
    }

    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('You can only review completed orders');
    }

    const existingReview = await this.prisma.review.findUnique({
      where: { orderId: data.orderId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this order');
    }

    const review = await this.prisma.review.create({
      data: {
        serviceId: data.serviceId || undefined,
        orderId: data.orderId,
        reviewerId,
        boosterId: order.service?.boosterId || order.boosterId,
        rating,
        comment,
      },
    });

    // Update booster profile rating
    await this.updateBoosterRating(order.service?.boosterId || order.boosterId);

    return review;
  }

  async findByService(serviceId: string) {
    return this.prisma.review.findMany({
      where: { serviceId },
      include: {
        reviewer: {
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

  async findByBooster(boosterId: string) {
    return this.prisma.review.findMany({
      where: { boosterId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async updateBoosterRating(boosterId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { boosterId },
    });

    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await this.prisma.boosterProfile.upsert({
      where: { userId: boosterId },
      update: {
        rating: avgRating,
        completedOrders: reviews.length,
      },
      create: {
        userId: boosterId,
        rating: avgRating,
        completedOrders: reviews.length,
      },
    });
  }
}
