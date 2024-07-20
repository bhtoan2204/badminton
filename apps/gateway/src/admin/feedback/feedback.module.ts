import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from '../admin.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
