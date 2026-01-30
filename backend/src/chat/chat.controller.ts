import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}

  @Post('conversations')
  createConversation(
    @Request() req,
    @Body() data: { otherUserId: string; serviceId?: string },
  ) {
    return this.chatService.createConversation(
      req.user.id,
      data.otherUserId,
      data.serviceId,
    );
  }

  @Get('conversations')
  getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Request() req,
    @Param('id') conversationId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.chatService.getMessages(
      req.user.id,
      conversationId,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
    );
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Request() req,
    @Param('id') conversationId: string,
    @Body() data: { content?: string; imageUrl?: string },
  ) {
    const message = await this.chatService.sendMessageHttp(req.user.id, conversationId, data.content, data.imageUrl);
    
    // Emit WebSocket events for real-time updates
    // Send to conversation room for users viewing the conversation
    this.chatGateway.server.to(`conversation:${conversationId}`).emit('newMessage', message);
    
    // Get conversation to notify other participants
    const conversation = await this.chatService.getConversation(conversationId, req.user.id);
    
    // Notify other participants (for notification badge/toast)
    conversation.participants.forEach((participant: any) => {
      if (participant.userId !== req.user.id) {
        this.chatGateway.server.to(`user:${participant.userId}`).emit('messageNotification', {
          conversationId: conversationId,
          message,
          from: message.sender,
        });
      }
    });
    
    return message;
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.chatService.getUnreadCount(req.user.id);
  }
}
