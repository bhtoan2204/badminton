import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { AssetService } from "./asset.service";
import { CurrentUser } from "../../utils";

@ApiTags('Asset')
@Controller('finance/asset')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AssetController {
  constructor(private readonly expenseService: AssetService ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Assets' })
  @Get('getAssets/:id_family')
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  async getExpense(@CurrentUser() user,
    @Param('id_family') id_family: string,
    @Query('page') page: string,
    @Query('itemsPerPage') itemsPerPage: string) {
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPageNumber = parseInt(itemsPerPage, 10) || 10;
    return this.expenseService.getAsset();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Asset' })
  @Post('createAsset')
  async createAsset() {
    return this.expenseService.createAsset();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Asset' })
  @Put('updateAsset')
  async updateAsset() {
    return this.expenseService.updateAsset();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Asset' })
  @Delete('deleteAsset')
  async deleteAsset() {
    return this.expenseService.deleteAsset();
  }
}