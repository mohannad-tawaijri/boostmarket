import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: string, serviceId: string) {
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        serviceId,
      },
      include: {
        service: {
          include: {
            booster: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Increment service like count
    await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return favorite;
  }

  async removeFavorite(userId: string, serviceId: string) {
    await this.prisma.favorite.delete({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    // Decrement service like count
    await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });

    return { success: true };
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        service: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async isFavorite(userId: string, serviceId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    return { isFavorite: !!favorite };
  }
}
