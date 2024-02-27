import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { RmqModule, Users } from "@app/common";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    RmqModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}