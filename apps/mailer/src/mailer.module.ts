import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { GrpcModule } from '@app/common';

@Module({
  imports: [
    GrpcModule
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
