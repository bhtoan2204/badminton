import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { SearchModule } from "./search/search.module";
import { ProxyModule } from "./proxy/proxy.module";
import { RabbitMqModule } from "./rabbitmq/rabbitmq.module";

@Module({
  imports: [
    SearchModule,
    ProxyModule,
    RabbitMqModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: '',
            module: SearchModule,
          }
        ],
      },
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: '',
            module: ProxyModule,
          }
        ],
      },
      {
        path: 'admin',
        module: RabbitMqModule,
        children: [
          {
            path: '',
            module: RabbitMqModule,
          }
        ],
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule { }