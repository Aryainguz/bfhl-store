import {
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './coupans.schema';
import { CheckCouponDto } from './dto/check-coupan-dto';
import { CreateCouponDto } from './dto/create-coupan.dto';
import { UpdateCouponDto } from './dto/update-coupan.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
  ) {}

  async create(dto: CreateCouponDto): Promise<Coupon> {
    if (dto.usedCount == null) dto.usedCount = 0;
    const created = new this.couponModel(dto);
    return created.save();
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().exec();
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) throw new NotFoundException(`Coupon ${id} not found`);
    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto): Promise<Coupon> {
    const updated = await this.couponModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!updated) throw new NotFoundException(`Coupon ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.couponModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Coupon ${id} not found`);
  }

  async check(dto: CheckCouponDto): Promise<{
    valid: boolean;
    discountAmount: number;
    message?: string;
  }> {
    const coupon = await this.couponModel
      .findOne({ code: dto.code.trim().toUpperCase() })
      .exec();
    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Coupon not found' };
    }

    const now = new Date();
    if (coupon.expiresAt < now) {
      return { valid: false, discountAmount: 0, message: 'Coupon expired' };
    }

    if (coupon.minOrderValue != null && dto.subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order value is ₹${coupon.minOrderValue}`,
      };
    }

    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
      return {
        valid: false,
        discountAmount: 0,
        message: 'Coupon usage limit reached',
      };
    }

    let discountAmt = coupon.discountAmount;

    return { valid: true, discountAmount: discountAmt };
  }

  async incrementUsage(code: string): Promise<void> {
    await this.couponModel
      .findOneAndUpdate(
        { code: code.trim().toUpperCase() },
        { $inc: { usedCount: 1 } },
      )
      .exec();
  }
}
