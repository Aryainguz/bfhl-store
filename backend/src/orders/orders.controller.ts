// src/orders/orders.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UsePipes(
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderDto) {
    const order: { _id: string } = await this.ordersService.create(dto);
    return { success: true, orderId: order._id.toString() };
  }

  @Get()
  async list() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
