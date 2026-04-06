import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CustomOffersService } from './custom-offers.service';
import { ChatGateway } from '../chat/chat.gateway';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('custom-offers')
@UseGuards(JwtAuthGuard)
export class CustomOffersController {
  constructor(
    private readonly customOffersService: CustomOffersService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body()
    body: {
      title: string;
      description?: string;
      price: number;
      deliveryTime: string;
      receiverId: string;
      conversationId: string;
      serviceId?: string;
    },
  ) {
    const result = await this.customOffersService.create(req.user.id, body);

    // Emit WebSocket events so the offer message appears in real-time
    this.chatGateway.server
      .to(`conversation:${body.conversationId}`)
      .emit('newMessage', result.message);

    this.chatGateway.server
      .to(`user:${body.receiverId}`)
      .emit('messageNotification', {
        conversationId: body.conversationId,
        message: result.message,
        from: result.message.sender,
      });

    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customOffersService.findOne(id);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string, @Request() req) {
    const result = await this.customOffersService.accept(id, req.user.id);

    // Notify the offer sender that it was accepted
    this.chatGateway.server
      .to(`user:${result.offer.senderId}`)
      .emit('offerStatusUpdate', {
        offerId: id,
        status: 'ACCEPTED',
        orderId: result.order.id,
      });

    return result;
  }

  @Post(':id/decline')
  async decline(@Param('id') id: string, @Request() req) {
    const result = await this.customOffersService.decline(id, req.user.id);

    // Notify the offer sender that it was declined
    this.chatGateway.server
      .to(`user:${result.senderId}`)
      .emit('offerStatusUpdate', {
        offerId: id,
        status: 'DECLINED',
      });

    return result;
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    const result = await this.customOffersService.cancel(id, req.user.id);

    // Notify the offer receiver that it was cancelled
    this.chatGateway.server
      .to(`user:${result.receiverId}`)
      .emit('offerStatusUpdate', {
        offerId: id,
        status: 'CANCELLED',
      });

    return result;
  }

  @Get()
  findByUser(@Request() req, @Query('type') type: 'sent' | 'received' = 'received') {
    return this.customOffersService.findByUser(req.user.id, type);
  }
}
