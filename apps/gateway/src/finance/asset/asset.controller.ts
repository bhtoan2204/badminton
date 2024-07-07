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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AssetService } from './asset.service';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FINANCE,
} from '../../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../../utils/interceptor/imageFile.interceptor';
import { UpdateAssetSchema } from './schema/updateAsset.schema';
import { CreateAssetSchema } from './schema/createAsset.schema';

@ApiTags('Asset')
@Controller('finance/asset')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
@Permission([PERMISSION_FINANCE])
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: CreateAssetSchema })
  @UseInterceptors(
    FileInterceptor('image', new ImageFileInterceptor().createMulterOptions()),
  )
  @Post('createAsset')
  async createAsset(
    @CurrentUser() currentUser,
    @Body()
    dto: {
      id_family: number;
      name: string;
      value: number;
      description: string;
      purchase_date: Date;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.expenseService.createAsset(currentUser.id_user, dto, file);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Asset' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: UpdateAssetSchema })
  @UseInterceptors(
    FileInterceptor('image', new ImageFileInterceptor().createMulterOptions()),
  )
  @Put('updateAsset')
  async updateAsset(
    @CurrentUser() currentUser,
    @Body()
    dto: {
      id_family: number;
      id_asset: number;
      name: string;
      value: number;
      description: string;
      purchase_date: Date;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.expenseService.updateAsset(currentUser.id_user, dto, file);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
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
