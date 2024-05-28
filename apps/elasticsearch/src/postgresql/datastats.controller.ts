import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, RmqContext } from "@nestjs/microservices";
import { RmqService } from "@app/common";
import { DataStatsService } from "./datastats.service";

@Controller()
export class DataStatsController {
  constructor(
    private readonly datastatsService: DataStatsService,
    private readonly rmqService: RmqService
  ) {}

  @EventPattern('datastatsClient/getPostgresqlStat')
  async getPostgresqlStat(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.datastatsService.getPostgresqlStat();
  }

  @EventPattern('datastatsClient/getMongooseStat')
  async getMongooseStat(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.datastatsService.getMongooseStat();
  }
}
