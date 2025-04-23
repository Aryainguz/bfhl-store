import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, min: 0 })
  discountAmount: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 0, min: 0 })
  usedCount: number;

  @Prop({ min: 0 })
  minOrderValue?: number;

  @Prop({ min: 0 })
  maxUses?: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
