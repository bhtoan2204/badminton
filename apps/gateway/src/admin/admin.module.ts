import { Module } from "@nestjs/common";
import { RoleModule } from "./role/role.module";
import { RouterModule } from "@nestjs/core";

@Module({
  imports: [
    RoleModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: '',
            module: RoleModule,
          },
        ],
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule { }