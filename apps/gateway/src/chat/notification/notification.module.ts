import { GlobalJwtModule } from '@app/common';
import { Module } from '@nestjs/common';
import { WsJwtStrategy } from '../../utils';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [GlobalJwtModule],
  controllers: [NotificationController],
  providers: [NotificationService, WsJwtStrategy],
})
export class NotificationModule {}
