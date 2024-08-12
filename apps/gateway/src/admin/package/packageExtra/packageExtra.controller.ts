import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from 'apps/gateway/src/utils';
import { PackageExtraService } from './packageExtra.service';
import { UpdatePackageExtraDto } from './dto/updatePackageExtra.dto';

@ApiTags('Admin Extra Package')
@Controller('packageExtra')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class PackageExtraController {
  constructor(private readonly packageExtraService: PackageExtraService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortDesc', required: false, type: Boolean })
  async getPackagesExtra(
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDesc') sortDesc: boolean,
  ): Promise<any> {
    return this.packageExtraService.getPackagesExtra(search, sortBy, sortDesc);
  }

  @Put()
  async updatePackageExtra(@Body() dto: UpdatePackageExtraDto): Promise<any> {
    return this.packageExtraService.updatePackageExtra(dto);
  }

  @Get('statistics')
  async getPackageExtraStatistics(): Promise<any> {
    return this.packageExtraService.getPackageExtraStatistics();
  }
}
