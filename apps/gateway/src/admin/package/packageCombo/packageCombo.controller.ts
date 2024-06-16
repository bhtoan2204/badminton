import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from 'apps/gateway/src/utils';
import { PackageComboService } from './packageCombo.service';
import { CreatePackageComboDto } from './dto/createPackageCombo.dto';
import { UpdatePackageComboDto } from './dto/updatePackageCombo.dto';

@ApiTags('Admin Combo Package')
@Controller('packageCombo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class PackageComboController {
  constructor(private readonly packageComboService: PackageComboService) {}

  @HttpCode(200)
  @Get()
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  async getPackagesCombo(
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ): Promise<any> {
    return this.packageComboService.getPackagesCombo(page, itemsPerPage);
  }

  @HttpCode(201)
  @Post()
  async createPackageCombo(@Body() dto: CreatePackageComboDto): Promise<any> {
    return this.packageComboService.createPackageCombo(dto);
  }

  @HttpCode(200)
  @Put(':id_combo_package')
  @ApiParam({ name: 'id_combo_package', required: true, type: Number })
  async updatePackageCombo(
    @Body() dto: UpdatePackageComboDto,
    @Param('id_combo_package') id_combo_package: number,
  ): Promise<any> {
    return this.packageComboService.updatePackageCombo(id_combo_package, dto);
  }

  @HttpCode(204)
  @Delete(':id_combo_package')
  @ApiParam({ name: 'id_combo_package', required: true, type: Number })
  async deletePackageCombo(
    @Param('id_combo_package') id_combo_package: number,
  ): Promise<any> {
    return this.packageComboService.deletePackageCombo(id_combo_package);
  }
}
