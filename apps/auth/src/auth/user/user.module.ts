import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { GrpcModule, RmqModule, Users } from "@app/common";
import { StorageModule } from "../../storage/storage.module";
import { STORAGE_SERVICE } from "../../utils/constants/service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    RmqModule,
    StorageModule,
    GrpcModule.register({ name: STORAGE_SERVICE }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}