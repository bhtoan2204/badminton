import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { MAILER_SERVICE } from "apps/gateway/src/utils/constant/services.constant";

@Module({
  imports: [
    RmqModule.register({ name: MAILER_SERVICE }),
  ],
  controllers: [],
  providers: [],
})
export class MailerModule {}