import { GlobalJwtModule, RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { AUTH_SERVICE, CHAT_SERVICE, FAMILY_SERVICE } from "../utils";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { WsJwtStrategy } from "../utils";
import { ChatService } from "./chat.service";

@Module({
  imports: [
    RmqModule.register({name: CHAT_SERVICE}),
    RmqModule.register({name: AUTH_SERVICE}),
    RmqModule.register({ name: FAMILY_SERVICE }),
    GlobalJwtModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, WsJwtStrategy, ChatService],
})
export class ChatModule {}