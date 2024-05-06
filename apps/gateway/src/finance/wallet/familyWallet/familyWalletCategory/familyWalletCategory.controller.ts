import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { FamilyWalletCategoryService } from "./familyWalletCategory.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../../auth/guard/jwt-auth.guard";
import { CurrentUser } from "apps/gateway/src/utils";
import { CreateFamilyWalletCategoryDto } from "./dto/createFamilyWalletCategory.dto";
import { UpdateFamilyWalletCategoryDto } from "./dto/updateFamilyWalletCategory.dto";

@ApiTags('Family Wallet Category')
@Controller('familyWalletCategory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FamilyWalletCategoryController {
  constructor(
    private readonly familyWalletCategoryService: FamilyWalletCategoryService
  ) {}
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get family wallet categories' })
  @Get('getFamilyWalletCategories/:id_family')
  async getFamilyWalletCategories(@CurrentUser() currentUser, @Param('id_family') id_family: number) {
    return this.familyWalletCategoryService.getFamilyWalletCategories(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create family wallet category' })
  @Post('createFamilyWalletCategory')
  async createFamilyWalletCategory(@CurrentUser() currentUser, @Body() dto: CreateFamilyWalletCategoryDto) {
    return this.familyWalletCategoryService.createFamilyWalletCategory(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update family wallet category' })
  @Put('updateFamilyWalletCategory')
  async updateFamilyWalletCategory(@CurrentUser() currentUser, @Body() dto: UpdateFamilyWalletCategoryDto) {
    return this.familyWalletCategoryService.updateFamilyWalletCategory(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete family wallet category' })
  @Delete('deleteFamilyWalletCategory/:id_family/:id_wallet_category')
  async deleteFamilyWalletCategory(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_wallet_category') id_wallet_category: number) {
    return this.familyWalletCategoryService.deleteFamilyWalletCategory(currentUser.id_user, id_family, id_wallet_category);
  }
}