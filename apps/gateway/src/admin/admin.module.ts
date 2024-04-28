import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    SearchModule,
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
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule { }