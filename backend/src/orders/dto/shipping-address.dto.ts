import { IsString, Length } from 'class-validator';

export class ShippingAddressDto {
  @IsString() @Length(1, 100)
  fullName: string;

  @IsString() @Length(5, 100)
  email: string;

  @IsString() @Length(7, 15)
  phone: string;

  @IsString() @Length(5, 200)
  address: string;

  @IsString() @Length(1, 50)
  city: string;

  @IsString() @Length(1, 50)
  state: string;

  @IsString() @Length(4, 10)
  zip: string;
}
