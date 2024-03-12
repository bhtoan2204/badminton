import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageContentSchema, MgDatabaseModule, RmqModule, MessageContent, FamilyMessageContentSchema, FamilyMessageContent } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_CHAT_QUEUE: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/chat/.env.production' : './apps/chat/.env',
    }),
    MgDatabaseModule,
    RmqModule,
    MongooseModule.forFeature([
      { name: MessageContent.name, schema: MessageContentSchema },
      { name: FamilyMessageContent.name, schema: FamilyMessageContentSchema}
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
