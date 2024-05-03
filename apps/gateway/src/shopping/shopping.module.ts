import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { SHOPPING_SERVICE } from "../utils";
import { ShoppingController } from "./shopping.controller";
import { ShoppingService } from "./shopping.service";

@Module({
  imports: [
    RmqModule.register({ name: SHOPPING_SERVICE })
  ],
  controllers: [ShoppingController],
  providers: [ShoppingService]
})
export class ShoppingModule { }