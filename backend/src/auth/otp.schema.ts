import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true, expires: '10m' }) // Document expires 10 minutes after creation
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
