import {
  Controller,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';
import { PostgresqlService } from './datastats.service';

@ApiTags('Admin Database')
@Controller('database-stat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class PostgresqlController {
  constructor(private readonly postgresqlService: PostgresqlService) {}

  @HttpCode(HttpStatus.OK)
  @Get('posgresql')
  async getPostgresqlStat() {
    return this.postgresqlService.getPostgresqlStat();
  }

  @HttpCode(HttpStatus.OK)
  @Get('mongoose')
  async getMongooseStat() {
    return this.postgresqlService.getMongooseStat();
  }
}
