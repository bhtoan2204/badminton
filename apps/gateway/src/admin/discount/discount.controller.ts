import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/createDiscount.dto';
import { UpdateDiscountDto } from './dto/updateDiscount.dto';

@ApiTags('Admin Discount')
@Controller('admin/discount')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  async getDiscounts() {
    return this.discountService.getDiscounts();
  }

  @Post()
  async addDiscount(@Body() dto: CreateDiscountDto) {
    return this.discountService.addDiscount(dto);
  }

  @Put()
  async updateDiscount(@Body() dto: UpdateDiscountDto) {
    return this.discountService.updateDiscount(dto);
  }

  @Delete(':code')
  async deleteDiscount(@Param('code') code: string) {
    return this.discountService.deleteDiscount(code);
  }
}
