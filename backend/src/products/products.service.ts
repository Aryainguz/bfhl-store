import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// generic type alias for responses.
type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(
    dto: CreateProductDto,
  ): Promise<ServiceResponse<Product>> {
    try {
      const created = new this.productModel(dto);
      const product = await created.save();
      return { success: true, data: product };
    } catch (error) {
      console.log(error)
      return { success: false, error: 'Error creating product' };
    }
  }

  async findAll(): Promise<ServiceResponse<Product[]>> {
    try {
      const products = await this.productModel.find().exec();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: 'Error fetching products' };
    }
  }

  async findOne(id: string): Promise<ServiceResponse<Product>> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        return { success: false, error: 'Product not found' };
      }
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: 'Error fetching the product' };
    }
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ServiceResponse<Product>> {
    try {
      const updated = await this.productModel
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();
      if (!updated) {
        return { success: false, error: 'Product not found' };
      }
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: 'Error updating product' };
    }
  }

  async remove(id: string): Promise<ServiceResponse<null>> {
    try {
      const result = await this.productModel.findByIdAndDelete(id).exec();
      if (!result) {
        return { success: false, error: 'Product not found' };
      }
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: 'Error deleting product' };
    }
  }
}
