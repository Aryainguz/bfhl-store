import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupan.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
