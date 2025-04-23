import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupan.dto';
import { CouponsService } from './coupans.service';
import { UpdateCouponDto } from './dto/update-coupan.dto';
import { CheckCouponDto } from './dto/check-coupan-dto';
  
  @Controller('coupons')
  @UsePipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  )
  export class CouponsController {
    constructor(private readonly couponsService: CouponsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateCouponDto) {
      const coupon = await this.couponsService.create(dto);
      return { success: true, coupon };
    }
  
    @Get()
    async list() {
      return this.couponsService.findAll();
    }
  
    @Get(':id')
    async get(@Param('id') id: string) {
      return this.couponsService.findOne(id);
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateCouponDto
    ) {
      return this.couponsService.update(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      await this.couponsService.remove(id);
      return { success: true };
    }
  
    @Post('check')
    async check(@Body() dto: CheckCouponDto) {
      return this.couponsService.check(dto);
    }
  }
  