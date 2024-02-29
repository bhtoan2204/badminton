import { GrpcModule } from "@app/common";
import { Module } from "@nestjs/common";
import { STORAGE_SERVICE } from "../utils/constants/service";
import { StorageService } from "./storage.service";

@Module({
  imports: [
    GrpcModule.register({ name: STORAGE_SERVICE }),
  ],
  providers: [ StorageService ],
  exports: [
    StorageService
  ]
})
export class StorageModule {}
