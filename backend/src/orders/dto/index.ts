import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  serviceId: string;

  @IsOptional()
  requirements?: any;
}

enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
