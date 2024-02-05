import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RmqModule } from '@app/common';

@Module({
  imports: [
    RmqModule.register({ name: 'PAYMENT_SERVICE' }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
