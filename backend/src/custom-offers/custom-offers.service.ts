import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OfferStatus } from '@prisma/client';

@Injectable()
export class CustomOffersService {
  constructor(private prisma: PrismaService) {}

  async create(
    senderId: string,
    data: {
      title: string;
      description?: string;
      price: number;
      deliveryTime: string;
      receiverId: string;
      conversationId: string;
      serviceId?: string;
    },
  ) {
    // Verify sender is a booster (by role OR by having services listed)
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      include: { _count: { select: { services: true } } },
    });

    const isBooster =
      sender?.role === 'BOOSTER' || (sender?._count?.services ?? 0) > 0;

    if (!sender || !isBooster) {
      throw new ForbiddenException('Only boosters can send custom offers');
    }

    // Ensure role is synced to BOOSTER if they have services
    if (sender.role !== 'BOOSTER' && (sender._count?.services ?? 0) > 0) {
      await this.prisma.user.update({
        where: { id: senderId },
        data: { role: 'BOOSTER' },
      });
    }

    // Verify receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: data.receiverId },
    });
    if (!receiver) {
      throw new BadRequestException('Recipient not found');
    }

    // Verify both users are participants in the conversation
    const participantCount = await this.prisma.conversationParticipant.count({
      where: {
        conversationId: data.conversationId,
        userId: { in: [senderId, data.receiverId] },
      },
    });
    if (participantCount !== 2) {
      throw new ForbiddenException('Both users must be participants in this conversation');
    }

    // Validate price
    if (data.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    // Create the custom offer and message in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the custom offer
      const customOffer = await tx.customOffer.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          deliveryTime: data.deliveryTime,
          senderId,
          receiverId: data.receiverId,
          serviceId: data.serviceId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        },
      });

      // Create a message with the custom offer attached
      const message = await tx.message.create({
        data: {
          conversationId: data.conversationId,
          senderId,
          receiverId: data.receiverId,
          content: `Custom Offer: ${data.title}`,
          customOfferId: customOffer.id,
        },
        include: {
          sender: {
            select: { id: true, name: true, avatar: true },
          },
          customOffer: true,
        },
      });

      // Update conversation's last message time
      await tx.conversation.update({
        where: { id: data.conversationId },
        data: { lastMessageAt: new Date() },
      });

      return { customOffer, message };
    });

    return result;
  }

  async findOne(id: string) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id },
      include: {
        message: {
          include: {
            sender: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Custom offer not found');
    }

    return offer;
  }

  async accept(offerId: string, userId: string) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new NotFoundException('Custom offer not found');
    }

    if (offer.receiverId !== userId) {
      throw new ForbiddenException('Only the recipient can accept this offer');
    }

    if (offer.status !== 'PENDING') {
      throw new BadRequestException('This offer has already been responded to');
    }

    // Check if expired
    if (offer.expiresAt && new Date() > offer.expiresAt) {
      await this.prisma.customOffer.update({
        where: { id: offerId },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('This offer has expired');
    }

    // Accept the offer and create an order in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          serviceId: offer.serviceId || undefined,
          buyerId: offer.receiverId,
          boosterId: offer.senderId,
          price: offer.price,
          status: 'PENDING',
          requirements: {
            customOffer: true,
            offerId: offer.id,
            title: offer.title,
            description: offer.description,
            deliveryTime: offer.deliveryTime,
          },
        },
        include: {
          service: true,
          buyer: {
            select: { id: true, name: true, email: true },
          },
          booster: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      // Update the offer status and link to order
      const updatedOffer = await tx.customOffer.update({
        where: { id: offerId },
        data: {
          status: 'ACCEPTED',
          orderId: order.id,
          respondedAt: new Date(),
        },
      });

      return { offer: updatedOffer, order };
    });

    return result;
  }

  async decline(offerId: string, userId: string) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new NotFoundException('Custom offer not found');
    }

    if (offer.receiverId !== userId) {
      throw new ForbiddenException('Only the recipient can decline this offer');
    }

    if (offer.status !== 'PENDING') {
      throw new BadRequestException('This offer has already been responded to');
    }

    const updatedOffer = await this.prisma.customOffer.update({
      where: { id: offerId },
      data: {
        status: 'DECLINED',
        respondedAt: new Date(),
      },
    });

    return updatedOffer;
  }

  async cancel(offerId: string, userId: string) {
    const offer = await this.prisma.customOffer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new NotFoundException('Custom offer not found');
    }

    if (offer.senderId !== userId) {
      throw new ForbiddenException('Only the sender can cancel this offer');
    }

    if (offer.status !== 'PENDING') {
      throw new BadRequestException('This offer has already been responded to');
    }

    const updatedOffer = await this.prisma.customOffer.update({
      where: { id: offerId },
      data: {
        status: 'CANCELLED',
        respondedAt: new Date(),
      },
    });

    return updatedOffer;
  }

  async findByUser(userId: string, type: 'sent' | 'received') {
    const where = type === 'sent' 
      ? { senderId: userId }
      : { receiverId: userId };

    return this.prisma.customOffer.findMany({
      where,
      include: {
        message: {
          include: {
            conversation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
