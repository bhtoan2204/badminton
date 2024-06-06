import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AssetService } from './asset.service';
import { CurrentUser, JwtAuthGuard, MemberFamilyGuard } from '../../utils';
import { CreateAssetDto } from './dto/createAsset.dto';
import { UpdateAssetDto } from './dto/updateAsset.dto';

@ApiTags('Asset')
@Controller('finance/asset')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
export class AssetController {
  constructor(private readonly expenseService: AssetService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Assets' })
  @Get('getAssets/:id_family')
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  async getExpense(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    const pageNumber = page || 1;
    const itemsPerPageNumber = itemsPerPage || 10;
    return this.expenseService.getAsset(
      currentUser.id_user,
      id_family,
      pageNumber,
      itemsPerPageNumber,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Asset' })
  @Post('createAsset')
  async createAsset(@CurrentUser() currentUser, @Body() dto: CreateAssetDto) {
    return this.expenseService.createAsset(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Asset' })
  @Put('updateAsset')
  async updateAsset(@CurrentUser() currentUser, @Body() dto: UpdateAssetDto) {
    return this.expenseService.updateAsset(currentUser.id_user, dto);
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Asset' })
  @Delete('deleteAsset/:id_family/:id_asset')
  async deleteAsset(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_asset') id_asset: number,
  ) {
    return this.expenseService.deleteAsset(
      currentUser.id_user,
      id_family,
      id_asset,
    );
  }
}
