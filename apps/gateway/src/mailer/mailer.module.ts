import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { MAILER_SERVICE } from "apps/gateway/src/utils/constant/services.constant";
import { MailController } from "./mailer.controller";
import { MailService } from "./mailer.service";

@Module({
  imports: [
    RmqModule.register({ name: MAILER_SERVICE }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}