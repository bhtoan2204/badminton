import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../utils';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [PaymentController, FeedbackController],
  providers: [PaymentService, FeedbackService],
})
export class PaymentModule {}
