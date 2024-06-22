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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';
import { ProxyService } from './proxy.service';
import { GetAnalyticsDto } from './dto/getAnalytics.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Admin Proxy')
@Controller('proxy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
@UseInterceptors(CacheInterceptor)
@CacheTTL(600)
@CacheKey('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @HttpCode(HttpStatus.OK)
  @Get('getZone')
  async getZone() {
    return this.proxyService.getZone();
  }

  @HttpCode(HttpStatus.OK)
  @Post('getAnalytics')
  async getAnalytics(@Body() body: GetAnalyticsDto) {
    return this.proxyService.getAnalytics(body);
  }
}
