import {
  Controller,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';
import { PostgresqlService } from './datastats.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Admin Database')
@Controller('database-stat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
@UseInterceptors(CacheInterceptor)
@CacheTTL(600)
@CacheKey('datastats')
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
