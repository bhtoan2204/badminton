import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../auth/guard/jwt-auth.guard";
import { CurrentUser } from "apps/gateway/src/utils";
import { FamilyWalletService } from "./familyWallet.service";
import { CreateFamilyWalletDto } from "./dto/createFamilyWallet.dto";
import { UpdateFamilyWalletDto } from "./dto/updateFamilyWallet.dto";

@ApiTags('Family Wallet')
@Controller('familyWallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FamilyWalletController {
  constructor(
    private readonly familyWalletService: FamilyWalletService
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get family wallet' })
  @Get('getFamilyWallet/:id_family')
  async getFamilyWalletCategories(@CurrentUser() currentUser, @Param('id_family') id_family: number) {
    return this.familyWalletService.getFamilyWallet(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create family wallet' })
  @Post('createFamilyWallet')
  async createFamilyWallet(@CurrentUser() currentUser, @Body() dto: CreateFamilyWalletDto) {
    return this.familyWalletService.createFamilyWallet(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update family wallet' })
  @Put('updateFamilyWallet')
  async updateFamilyWallet(@CurrentUser() currentUser, @Body() dto: UpdateFamilyWalletDto) {
    return this.familyWalletService.updateFamilyWallet(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete family wallet' })
  @Delete('deleteFamilyWallet/:id_family/:id_wallet')
  @ApiParam({ name: 'id_family', type: Number })
  @ApiParam({ name: 'id_wallet', type: Number })
  async deleteFamilyWallet(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_wallet') id_wallet: number) {
    return this.familyWalletService.deleteFamilyWallet(currentUser.id_user, id_family, id_wallet);
  }
}