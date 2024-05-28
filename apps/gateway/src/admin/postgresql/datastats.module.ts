import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { ELASTICSEARCH_SERVICE } from "../../utils";
import { PostgresqlService } from "./datastats.service";
import { PostgresqlController } from "./datastats.controller";

@Module({
  imports: [
    RmqModule.register({ name: ELASTICSEARCH_SERVICE }),
  ],
  controllers: [PostgresqlController],
  providers: [PostgresqlService],
})
export class PostgresqlModule { }