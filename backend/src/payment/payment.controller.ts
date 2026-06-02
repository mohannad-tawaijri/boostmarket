import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /** Create a pending payment record (requires auth) */
  @Post()
  @UseGuards(JwtAuthGuard)
  createPayment(
    @Request() req,
    @Body() createData: { orderId: string; paymentMethod: string },
  ) {
    return this.paymentService.createPayment(req.user.id, createData);
  }

  /** Called from frontend after Moyasar redirects back (requires auth) */
  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  verifyPayment(
    @Request() req,
    @Body() body: { paymentId: string },
  ) {
    // Only paymentId is trusted from the client; the order, amount and status
    // are resolved authoritatively from Moyasar inside the service.
    return this.paymentService.verifyMoyasarPayment(req.user.id, {
      paymentId: body?.paymentId,
    });
  }

  /**
   * Moyasar webhook — no auth guard, Moyasar posts here directly.
   * Secure via MOYASAR_WEBHOOK_SECRET in payload.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() payload: any) {
    return this.paymentService.handleWebhook(payload);
  }

  /** Get payment info for an order (requires auth) */
  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  getPayment(@Param('orderId') orderId: string, @Request() req) {
    return this.paymentService.getPayment(orderId, req.user.id);
  }
}
