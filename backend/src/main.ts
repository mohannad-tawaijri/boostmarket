import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  // Fail fast on a missing/weak signing secret rather than booting with an
  // insecure (or undefined) JWT secret that would silently weaken all auth.
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error(
      'JWT_SECRET must be set and at least 32 characters long. Refusing to start.',
    );
  }

  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Enable CORS for specific origins only
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://boostmarket.app',
    'https://www.boostmarket.app',
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}
bootstrap();
