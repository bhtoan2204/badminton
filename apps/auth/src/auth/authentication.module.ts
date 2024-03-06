import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { UserModule } from "./user/user.module";
import { GlobalJwtModule, RmqModule } from "@app/common";

@Module({
  imports: [
    UserModule,
    GlobalJwtModule,
    RmqModule
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}