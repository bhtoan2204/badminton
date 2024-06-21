import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PackageMainService } from './packageMain.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from 'apps/gateway/src/utils';
import { CreatePackageMainDto } from './dto/createPackageMain.dto';
import { UpdatePackageMainDto } from './dto/updatePackageMain.dto';

@ApiTags('Admin Main Package')
@Controller('packageMain')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class PackageMainController {
  constructor(private readonly packageMainService: PackageMainService) {}

  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortDesc', required: false, type: Boolean })
  @Get('getAllPackage')
  async getAllPackage(
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDesc') sortDesc: boolean,
  ) {
    return this.packageMainService.getAllPackage(
      page,
      itemsPerPage,
      search,
      sortBy,
      sortDesc,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async createPackage(@Body() dto: CreatePackageMainDto) {
    return this.packageMainService.createPackage(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async updatePackage(@Body() dto: UpdatePackageMainDto) {
    return this.packageMainService.updatePackage(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id_main_package')
  async deletePackage(@Query('id_main_package') id_main_package: number) {
    return this.packageMainService.deletePackage(id_main_package);
  }
}
