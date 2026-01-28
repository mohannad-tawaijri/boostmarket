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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('custom-offers')
@UseGuards(JwtAuthGuard)
export class CustomOffersController {
  constructor(private readonly customOffersService: CustomOffersService) {}

  @Post()
  create(
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
    return this.customOffersService.create(req.user.id, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customOffersService.findOne(id);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @Request() req) {
    return this.customOffersService.accept(id, req.user.id);
  }

  @Post(':id/decline')
  decline(@Param('id') id: string, @Request() req) {
    return this.customOffersService.decline(id, req.user.id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.customOffersService.cancel(id, req.user.id);
  }

  @Get()
  findByUser(@Request() req, @Query('type') type: 'sent' | 'received' = 'received') {
    return this.customOffersService.findByUser(req.user.id, type);
  }
}
