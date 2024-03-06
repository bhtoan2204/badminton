import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { PAYMENT_SERVICE } from "../utils/constant/services.constant";

@Module({
  imports: [
    RmqModule.register({ name: PAYMENT_SERVICE }),
  ],
  controllers: [],
  providers: [],
})
export class PaymentModule { }