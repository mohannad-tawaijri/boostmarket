import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll(@Request() req, @Query('role') role: 'buyer' | 'booster' = 'buyer') {
    return this.ordersService.findAll(req.user.id, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @Post()
  create(@Request() req, @Body() createData: any) {
    return this.ordersService.create(req.user.id, createData);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, req.user.id, status);
  }
}
