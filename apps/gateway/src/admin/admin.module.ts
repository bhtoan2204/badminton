import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { SearchModule } from "./search/search.module";
import { ProxyModule } from "./proxy/proxy.module";

@Module({
  imports: [
    SearchModule,
    ProxyModule,
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
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule { }