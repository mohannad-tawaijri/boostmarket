import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://boostmarket.app',
    ],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      // Store socket connection
      client.data.userId = userId;
      
      const wasOffline = !this.userSockets.has(userId);
      const userSocketIds = this.userSockets.get(userId) || [];
      userSocketIds.push(client.id);
      this.userSockets.set(userId, userSocketIds);

      // Join user's personal room
      client.join(`user:${userId}`);

      // Broadcast online status (only on first connection, respect privacy)
      if (wasOffline) {
        const privacy = await this.chatService.getUserPrivacy(userId);
        if (privacy?.showOnlineStatus) {
          this.server.emit('userOnline', { userId });
        }
        // Mark pending messages as delivered
        await this.chatService.markMessagesAsDelivered(userId);
      }
      
      console.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      console.error('Socket connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const userSocketIds = this.userSockets.get(userId) || [];
      const filteredIds = userSocketIds.filter(id => id !== client.id);
      
      if (filteredIds.length > 0) {
        this.userSockets.set(userId, filteredIds);
      } else {
        this.userSockets.delete(userId);
        // Broadcast offline status (respect privacy)
        const privacy = await this.chatService.getUserPrivacy(userId);
        if (privacy?.showOnlineStatus) {
          this.server.emit('userOffline', { userId, lastSeen: new Date() });
        }
      }
      
      console.log(`User ${userId} disconnected socket ${client.id}`);
    }
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.join(`conversation:${conversationId}`);
    console.log(`Socket ${client.id} joined conversation ${conversationId}`);
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.leave(`conversation:${conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      const message = await this.chatService.sendMessage(
        data.conversationId,
        userId,
        data.content,
      );

      // Emit to all users in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('newMessage', message);

      // Get conversation to notify other participants
      const conversation = await this.chatService.getConversation(data.conversationId, userId);
      
      // Notify other participants who aren't in the conversation room
      conversation.participants.forEach((participant: any) => {
        if (participant.userId !== userId) {
          const receiverId = participant.userId;

          this.server.to(`user:${receiverId}`).emit('messageNotification', {
            conversationId: data.conversationId,
            message,
            from: message.sender,
          });

          // Auto-mark as DELIVERED if recipient is online
          if (this.isUserOnline(receiverId)) {
            this.chatService.markMessagesAsDelivered(receiverId).then(() => {
              // Notify sender of delivery
              this.server.to(`user:${userId}`).emit('messageStatusUpdate', {
                conversationId: data.conversationId,
                messageIds: [message.id],
                status: 'DELIVERED',
              });
            });
          }
        }
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    // Find IDs of messages that will be marked as read
    const unreadMessages = await this.chatService.getUnreadMessageIds(conversationId, userId);
    const result = await this.chatService.markMessagesAsRead(conversationId, userId);

    if (result.count > 0 && unreadMessages.length > 0) {
      // Check if this user allows read receipts
      const privacy = await this.chatService.getUserPrivacy(userId);
      if (privacy?.showReadReceipts) {
        // Notify the other participants that messages were read
        const conversation = await this.chatService.getConversation(conversationId, userId);
        conversation.participants.forEach((participant: any) => {
          if (participant.userId !== userId) {
            this.server.to(`user:${participant.userId}`).emit('messageStatusUpdate', {
              conversationId,
              messageIds: unreadMessages,
              status: 'READ',
              readBy: userId,
            });
          }
        });
      }
    }
  }

  @SubscribeMessage('getOnlineUsers')
  async handleGetOnlineUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() userIds: string[],
  ) {
    if (!Array.isArray(userIds)) return;
    const onlineUsers: string[] = [];
    for (const id of userIds) {
      if (this.isUserOnline(id)) {
        const privacy = await this.chatService.getUserPrivacy(id);
        if (privacy?.showOnlineStatus) {
          onlineUsers.push(id);
        }
      }
    }
    client.emit('onlineUsersList', onlineUsers);
  }

  // Method to emit events from outside the gateway
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
