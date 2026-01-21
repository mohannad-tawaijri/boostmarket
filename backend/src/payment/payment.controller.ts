import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  createPayment(@Body() createData: any) {
    return this.paymentService.createPayment(createData);
  }

  @Get(':orderId')
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentService.getPayment(orderId);
  }
}
