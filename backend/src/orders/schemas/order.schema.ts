import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderItem, OrderItemSchema } from './order-item.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true, enum: ['free','standard','express'] })
  shippingMethod: string;

  @Prop({ required: true, min: 0 })
  shippingCost: number;

  @Prop({ required: true, type: Object })
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };

  @Prop({ required: false })
  coupon?: string;

  @Prop({ required: true, min: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'pending', enum: ['pending','paid','failed'] })
  paymentStatus: string;

  @Prop({ required: false })
  paymentId?: string;

  @Prop({ required: false })
  orderId?: string;

  @Prop({ required: false })
  signature?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
