import { Module, forwardRef } from "@nestjs/common";
import { DatafetcherController } from "./datafetcher.controller";
import { DatafetcherService } from "./datafetcher.service";
import { SearchModule } from "../elasticsearch.module";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "@app/common";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    DatabaseModule,
    forwardRef(() => SearchModule),
  ],
  controllers: [DatafetcherController],
  providers: [DatafetcherService],
})
export class DatafetcherModule { }