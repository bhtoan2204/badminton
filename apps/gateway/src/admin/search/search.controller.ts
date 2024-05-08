import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { AdminGuard } from "../../auth/guard/authorize/role.guard";
import { Admin } from "../../utils";
import { SearchService } from "./search.service";

@ApiTags('Admin Logs')
@Controller('logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @HttpCode(HttpStatus.OK)
  @Get('getLogsCount')
  async getLogsCount() {
    return this.searchService.getLogsCount();
  }
}