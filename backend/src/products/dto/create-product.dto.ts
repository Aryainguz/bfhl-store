import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  // @IsOptional()
  // @IsNumber()
  // rating?: number;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  // @IsOptional()
  // @IsString()
  // usage?: string;
}
