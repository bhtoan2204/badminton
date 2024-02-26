import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { RmqModule } from '@app/common';

@Module({
  imports: [RmqModule],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
