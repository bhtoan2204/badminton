import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from '../admin.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { RmqModule } from '@app/common';
import { PAYMENT_SERVICE } from '../../utils';

@Module({
  imports: [
    RmqModule.register({ name: PAYMENT_SERVICE }),
    forwardRef(() => AdminModule),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
