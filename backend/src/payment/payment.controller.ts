import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  createPayment(@Request() req, @Body() createData: { orderId: string; paymentMethod: string }) {
    return this.paymentService.createPayment(req.user.id, createData);
  }

  @Get(':orderId')
  getPayment(@Param('orderId') orderId: string, @Request() req) {
    return this.paymentService.getPayment(orderId, req.user.id);
  }
}
