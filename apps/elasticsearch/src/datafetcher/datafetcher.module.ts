import { Module, forwardRef } from "@nestjs/common";
import { DatafetcherController } from "./datafetcher.controller";
import { DatafetcherService } from "./datafetcher.service";
import { SearchModule } from "../elasticsearch.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => SearchModule)
  ],
  controllers: [DatafetcherController],
  providers: [DatafetcherService],
})
export class DatafetcherModule { }