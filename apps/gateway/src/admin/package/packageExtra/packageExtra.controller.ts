import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  async getPackagesExtra(): Promise<any> {
    return this.packageExtraService.getPackagesExtra();
  }

  @Put()
  async updatePackageExtra(@Body() dto: UpdatePackageExtraDto): Promise<any> {
    return this.packageExtraService.updatePackageExtra(dto);
  }
}
