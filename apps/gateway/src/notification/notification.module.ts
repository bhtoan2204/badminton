import { GlobalJwtModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  FAMILY_SERVICE,
  BACKGROUND_SERVICE,
  WsJwtStrategy,
} from '../utils';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    RmqModule.register({ name: BACKGROUND_SERVICE }),
    RmqModule.register({ name: AUTH_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    GlobalJwtModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway, WsJwtStrategy],
})
export class NotificationModule {}
