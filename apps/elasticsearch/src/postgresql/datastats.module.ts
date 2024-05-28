import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SearchModule } from "../elasticsearch.module";
import { DatabaseModule, MgDatabaseModule } from "@app/common";
import { DataStatsController } from "./datastats.controller";
import { DataStatsService } from "./datastats.service";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    MgDatabaseModule,
    forwardRef(() => SearchModule),
  ],
  controllers: [DataStatsController],
  providers: [DataStatsService],
})
export class DataStatsModule { }