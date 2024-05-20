import { Controller, UseGuards, Get, Param, HttpStatus, HttpCode, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { AdminGuard } from "../../auth/guard/authorize/role.guard";
import { Admin } from "../../utils";
import { RabbitMqService } from "./rabbitmq.service";

@ApiTags('Admin Message Broker')
@Controller('rabbitmq')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class RabbitMqController {
  constructor(
    private readonly rabbitMQService: RabbitMqService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('/queues')
  async getQueues(): Promise<any> {
    return this.rabbitMQService.getQueues();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/queues/:queueName')
  async getQueueDetails(@Param('queueName') queueName: string): Promise<any> {
    return this.rabbitMQService.getQueueDetails(queueName);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/nodes')
  async getNode(): Promise<any> {
    return this.rabbitMQService.getNode();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/nodes/:nodeName/statistics')
  async getNodesStatistics(@Param('nodeName') nodeName: string): Promise<any> {
    return this.rabbitMQService.getNodeStatistics(nodeName);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/logs')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getLogs(@Query('limit') limit: number, @Query('offset') offset: number): Promise<any> {
    if (!limit) limit = 100;
    if (!offset) offset = 0;
    return this.rabbitMQService.getLogs(limit, offset);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/health')
  async healthCheck(): Promise<any> {
    return this.rabbitMQService.healthCheck();
  }
}