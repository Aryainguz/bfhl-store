import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsArray,
  IsNumber,
  Min,
  IsString,
  IsOptional,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { ShippingDto } from './shipping.dto';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => ShippingDto)
  shipping: ShippingDto;

  @IsString()
  @IsOptional()
  coupon?: string;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsNumber()
  @Min(0)
  amount: number;

}
