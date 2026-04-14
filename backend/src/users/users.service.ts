import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; password: string; name: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        verified: true,
        password: true,
        authProvider: true,
        notifyEmail: true,
        notifyOrders: true,
        notifyMessages: true,
        notifyMarketing: true,
        showMessagePopups: true,
        showProfile: true,
        showOnlineStatus: true,
        showReadReceipts: true,
        createdAt: true,
        boosterProfile: true,
        _count: {
          select: { services: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...rest } = user;
    return { ...rest, hasPassword: !!password };
  }

  async findPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        verified: true,
        showProfile: true,
        showOnlineStatus: true,
        createdAt: true,
        boosterProfile: {
          select: {
            rating: true,
            completedOrders: true,
            verified: true,
            availableForHire: true,
            games: true,
          },
        },
        services: {
          where: { active: true },
          select: {
            id: true,
            title: true,
            game: true,
            category: true,
            price: true,
            images: true,
            deliveryTime: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
        receivedReviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewer: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            services: { where: { active: true } },
            receivedReviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.showProfile) {
      return { id: user.id, name: user.name, avatar: user.avatar, profileHidden: true };
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(params?: { role?: string; skip?: number; take?: number }) {
    const { role, skip, take } = params || {};

    return this.prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        verified: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        verified: true,
        notifyEmail: true,
        notifyOrders: true,
        notifyMessages: true,
        notifyMarketing: true,
        showMessagePopups: true,
        showProfile: true,
        showOnlineStatus: true,
        showReadReceipts: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
