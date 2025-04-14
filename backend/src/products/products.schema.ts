import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ default: false })
  isNew?: boolean;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  stock: number;

  @Prop()
  usage?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
