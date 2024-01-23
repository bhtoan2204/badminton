import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { RmqModule } from "@app/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../utils/models/user.model";
import { Otp } from "../../utils/models/otp.model";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    RmqModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}