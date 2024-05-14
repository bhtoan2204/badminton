import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { SavingService } from "./saving.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";

@ApiTags('Saving')
@Controller('finance/saving')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SavingController {
  constructor( private readonly savingService: SavingService ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get savings' })
  @Get('getSaving')
  async getSaving() {
    return this.savingService.getSaving();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create saving' })
  @Post('createSaving')
  async createSaving() {
    return this.savingService.createSaving();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update saving' })
  @Put('updateSaving')
  async updateSaving() {
    return this.savingService.updateSaving();
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete saving' })
  @Delete('deleteSaving')
  async deleteSaving() {
    return this.savingService.deleteSaving();
  }
}