import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { AdminGuard } from "../auth/guard/authorize/role.guard";
import { AdminService } from "./admin.service";
import { Admin } from "../utils/decorator/role.decorator";

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('test')
  async test() {
    return this.adminService.test();
  }
}