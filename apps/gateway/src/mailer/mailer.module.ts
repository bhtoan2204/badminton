import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { USER_SERVICE } from '../utils';
import { MailController } from './mailer.controller';
import { MailService } from './mailer.service';

@Module({
  imports: [RmqModule.register({ name: USER_SERVICE })],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
