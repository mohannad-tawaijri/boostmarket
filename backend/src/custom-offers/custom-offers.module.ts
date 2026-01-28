import { Module } from '@nestjs/common';
import { CustomOffersService } from './custom-offers.service';
import { CustomOffersController } from './custom-offers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [PrismaModule, MessagesModule],
  controllers: [CustomOffersController],
  providers: [CustomOffersService],
  exports: [CustomOffersService],
})
export class CustomOffersModule {}
