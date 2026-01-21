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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

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
  sendMessage(
    @Request() req,
    @Param('id') conversationId: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(req.user.id, conversationId, content);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.chatService.getUnreadCount(req.user.id);
  }
}
