import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../../utils';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
