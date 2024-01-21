import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RmqModule } from "@app/common";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  imports: [RmqModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}