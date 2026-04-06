import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(boosterId: string, data: any) {
    // Upgrade user role to BOOSTER when they create their first service
    await this.prisma.user.update({
      where: { id: boosterId },
      data: { role: 'BOOSTER' },
    });

    return this.prisma.service.create({
      data: {
        ...data,
        boosterId,
      },
      include: {
        booster: {
          select: {
            id: true,
            name: true,
            avatar: true,
            boosterProfile: true,
          },
        },
      },
    });
  }

  async findAll(params?: {
    game?: string;
    category?: string;
    featured?: boolean;
    sortBy?: string;
    skip?: number;
    take?: number;
  }) {
    const { game, category, featured, sortBy, skip, take } = params || {};

    let orderBy: any = { createdAt: 'desc' };
    
    if (sortBy === 'price_low') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_high') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'most_liked') {
      orderBy = { likeCount: 'desc' };
    } else if (sortBy === 'most_viewed') {
      orderBy = { viewCount: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const services = await this.prisma.service.findMany({
      where: {
        active: true,
        ...(game && { game: game as any }),
        ...(category && { category: category as any }),
        ...(featured !== undefined && { featured }),
      },
      skip,
      take: take || 20,
      include: {
        booster: {
          select: {
            id: true,
            name: true,
            avatar: true,
            boosterProfile: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy,
    });

    // Calculate average ratings
    return services.map(service => ({
      ...service,
      averageRating: service.reviews.length > 0
        ? service.reviews.reduce((acc, r) => acc + r.rating, 0) / service.reviews.length
        : 0,
      reviewCount: service._count.reviews,
      favoriteCount: service._count.favorites,
    }));
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        booster: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            boosterProfile: true,
          },
        },
        reviews: {
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
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: string, boosterId: string, data: any) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.boosterId !== boosterId) {
      throw new ForbiddenException('You can only update your own services');
    }

    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, boosterId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.boosterId !== boosterId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.service.findMany({
      where: { boosterId: userId },
      include: {
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
