import { IsString, IsNumber, Min } from 'class-validator';

export class CheckCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  @Min(0)
  subtotal: number;
}
