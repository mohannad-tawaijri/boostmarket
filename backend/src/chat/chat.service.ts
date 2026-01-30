import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userId: string, otherUserId: string, serviceId?: string) {
    // Check if conversation already exists between these two specific users
    // Each user-to-user pair gets one conversation (not per service)
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
          {
            participants: {
              some: {
                userId: otherUserId,
              },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    return this.prisma.conversation.create({
      data: {
        serviceId,
        participants: {
          create: [
            { userId },
            { userId: otherUserId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async sendMessageHttp(userId: string, conversationId: string, content?: string, imageUrl?: string) {
    // Verify user is part of conversation
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    // Get the other participant
    const otherParticipant = await this.prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: {
          not: userId,
        },
      },
    });

    if (!otherParticipant) {
      throw new NotFoundException('Conversation participant not found');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        receiverId: otherParticipant.userId,
        content: content || null,
        imageUrl: imageUrl || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Update conversation lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
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
        lastMessageAt: 'desc',
      },
    });

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: userId,
            read: false,
          },
        });
        return {
          ...conv,
          unreadCount,
        };
      })
    );

    return conversationsWithUnread;
  }

  async getMessages(userId: string, conversationId: string, skip = 0, take = 50) {
    // Verify user is part of conversation
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        customOffer: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip,
      take,
    });

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return messages;
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  // WebSocket gateway sendMessage (conversationId first)
  async sendMessage(conversationId: string, userId: string, content?: string, imageUrl?: string) {
    // Verify user is part of conversation
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    // Get the other participant
    const otherParticipant = await this.prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: {
          not: userId,
        },
      },
    });

    if (!otherParticipant) {
      throw new NotFoundException('Conversation participant not found');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        receiverId: otherParticipant.userId,
        content: content || null,
        imageUrl: imageUrl || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Update conversation lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }
}
