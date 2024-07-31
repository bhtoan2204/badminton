import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import {
  MgDatabaseModule,
  NotificationData,
  NotificationDataSchema,
  RmqModule,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationProcessor } from './notification.processor';
import { FamilyModule } from '../family/family.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MgDatabaseModule,
    MongooseModule.forFeature([
      { name: NotificationData.name, schema: NotificationDataSchema },
    ]),
    FamilyModule,
    UserModule,
    RmqModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationProcessor],
})
export class NotificationModule {}
