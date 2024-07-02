import { forwardRef, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import {
  MgDatabaseModule,
  NotificationData,
  NotificationDataSchema,
  MemberFamily,
  DatabaseModule,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationProcessor } from './notification.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackgroundModule } from '../background.module';

@Module({
  imports: [
    MgDatabaseModule,
    MongooseModule.forFeature([
      { name: NotificationData.name, schema: NotificationDataSchema },
    ]),
    TypeOrmModule.forFeature([MemberFamily]),
    DatabaseModule,
    forwardRef(() => BackgroundModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationProcessor],
})
export class NotificationModule {}
