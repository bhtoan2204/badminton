import { GlobalJwtModule, RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { CHAT_SERVICE } from "../utils/constant/services.constant";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";

@Module({
  imports: [
    RmqModule.register({name: CHAT_SERVICE}),
    GlobalJwtModule
  ],
  controllers: [ChatController],
  providers: [ChatGateway],
})
export class ChatModule {}