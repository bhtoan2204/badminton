import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { OTP, RmqModule, User } from "@app/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OTP]),
    RmqModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}