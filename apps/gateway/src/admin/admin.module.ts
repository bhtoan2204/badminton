import { Module } from "@nestjs/common";
import { SearchModule } from "./search/search.module";
import { ProxyModule } from "./proxy/proxy.module";
import { RabbitMqModule } from "./rabbitmq/rabbitmq.module";

@Module({
  imports: [
    SearchModule,
    ProxyModule,
    RabbitMqModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule { }