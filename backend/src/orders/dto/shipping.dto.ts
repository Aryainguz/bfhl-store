import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsString,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { ShippingAddressDto } from './shipping-address.dto';

export enum ShippingMethod {
  FREE = 'free',
  STANDARD = 'standard',
  EXPRESS = 'express',
}

export class ShippingDto {
  @IsEnum(ShippingMethod)
  method: ShippingMethod;

  @IsNumber()
  @Min(0)
  cost: number;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  address: ShippingAddressDto;
}
