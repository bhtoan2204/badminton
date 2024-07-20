import { forwardRef, Module } from '@nestjs/common';
import { PaymentModule } from '../payment.module';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from '@app/common';

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    TypeOrmModule.forFeature([Discount]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
