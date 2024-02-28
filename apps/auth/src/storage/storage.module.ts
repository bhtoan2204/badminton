import { GrpcModule } from "@app/common";
import { Module } from "@nestjs/common";
import { STORAGE_SERVICE } from "../utils/constants/service";

@Module({
  imports: [
    GrpcModule.register({ name: STORAGE_SERVICE }),
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
