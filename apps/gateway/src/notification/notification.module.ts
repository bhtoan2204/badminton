import { GlobalJwtModule, RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { AUTH_SERVICE, NOTIFICATION_SERVICE, WsJwtStrategy } from "../utils";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { NotificationGateway } from "./notification.gateway";

@Module({
  imports: [
    RmqModule.register({ name: NOTIFICATION_SERVICE }),
    RmqModule.register({ name: AUTH_SERVICE }),
    GlobalJwtModule
  ],
  controllers: [
    NotificationController
  ],
  providers: [
    NotificationService,
    NotificationGateway,
    WsJwtStrategy
  ]
})
export class NotificationModule { }