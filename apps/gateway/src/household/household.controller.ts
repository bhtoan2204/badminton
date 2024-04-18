import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { HouseholdService } from "./household.service";

@ApiTags('Household')
@Controller('household')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HouseholdController {
  constructor(
    private readonly householdService: HouseholdService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get household category' })
  @Get('getHouseholdCategory')
  async getHousehold() {
    return this.householdService.getCategory();
  }
}