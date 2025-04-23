import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';  
import { CouponsService } from '../coupans/coupans.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly couponsService: CouponsService,
  ) {}

  async create(dto: CreateOrderDto): Promise<any>  {
    if (dto.coupon) {
      const { valid, discountAmount, message } = await this.couponsService.check({
        code: dto.coupon,
        subtotal: dto.shipping.cost + dto.amount / 100,
      });
      if (!valid) throw new BadRequestException(message);
      await this.couponsService.incrementUsage(dto.coupon);
      dto.discount = discountAmount;
    }

    const orderDoc = new this.orderModel({
      items: dto.items,
      shippingMethod: dto.shipping.method,
      shippingCost: dto.shipping.cost,
      shippingAddress: dto.shipping.address,
      coupon: dto.coupon || null,
      discount: dto.discount,
      amount: dto.amount / 100,
      paymentStatus: 'pending',
    });

    return orderDoc.save(); 
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
}
