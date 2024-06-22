import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';
import { SearchService } from './search.service';
import { GetLogsFilterDto } from './dto/getLogFilter.dto';
import { GetCountLogsByTimeRangeDto } from './dto/getCountLogsByTimeRange.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Admin Logs')
@Controller('logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
@UseInterceptors(CacheInterceptor)
@CacheTTL(600)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get logs count' })
  @Get('getLogsCount')
  async getLogsCount() {
    return this.searchService.getLogsCount();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get logs' })
  @Post('getLogs')
  async getLogs(@Body() dto: GetLogsFilterDto) {
    return this.searchService.getLogs(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get logs count by time range' })
  @Post('getLogsCountByTimeRange')
  async getLogsCountByTimeRange(@Body() dto: GetCountLogsByTimeRangeDto) {
    return this.searchService.getLogsCountByTimeRange(dto);
  }
}
