import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    return this.reviewsService.findByService(serviceId);
  }

  @Get('booster/:boosterId')
  findByBooster(@Param('boosterId') boosterId: string) {
    return this.reviewsService.findByBooster(boosterId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createData: any) {
    return this.reviewsService.create(req.user.id, createData);
  }
}
