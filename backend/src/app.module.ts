import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadModule } from './upload/upload.module';
import { ChatModule } from './chat/chat.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CustomOffersModule } from './custom-offers/custom-offers.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    OrdersModule,
    PaymentModule,
    ReviewsModule,
    UploadModule,
    ChatModule,
    FavoritesModule,
    CustomOffersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
