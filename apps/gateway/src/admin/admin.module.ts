import { Module } from "@nestjs/common";
import { RoleModule } from "./role/role.module";
import { RouterModule } from "@nestjs/core";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    RoleModule,
    SearchModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: '',
            module: RoleModule,
          },
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