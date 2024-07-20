import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [],
  controllers: [PaymentController, FeedbackController],
  providers: [PaymentService, FeedbackService],
})
export class PaymentModule {}
