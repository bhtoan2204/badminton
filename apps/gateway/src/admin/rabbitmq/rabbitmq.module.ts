import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { ELASTICSEARCH_SERVICE } from "../../utils";
import { RabbitMqController } from "./rabbitmq.controller";
import { RabbitMqService } from "./rabbitmq.service";

@Module({
  imports: [
    RmqModule.register({ name: ELASTICSEARCH_SERVICE })
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule { }