import { Module, forwardRef } from "@nestjs/common";
import { SearchModule } from "../elasticsearch.module";
import { ConfigModule } from "@nestjs/config";
import { RabbitMqController } from "./rabbitmq.controller";
import { RabbitMqService } from "./rabbitmq.service";
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    forwardRef(() => SearchModule)
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule { }