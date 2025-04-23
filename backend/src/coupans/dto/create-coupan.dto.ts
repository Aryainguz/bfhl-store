import { IsString, IsNumber, Min, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  @Min(0)
  discountAmount: number;

  @IsDateString()
  expiresAt: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderValue?: number;   

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxUses?: number;          

  @IsNumber()
  @Min(0)
  @IsOptional()
  usedCount?: number;      
}
