import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { AdminGuard } from "../../auth/guard/authorize/role.guard";
import { Admin } from "../../utils";

@ApiTags('Role')
@Controller('role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @HttpCode(HttpStatus.OK)
  @Get('getAllRole')
  async getallrole() {
    return this.roleService.getAllRole();
  }

  @HttpCode(HttpStatus.OK)
  @Get('getRole')
  async getrole(@Query('family') family: number, @Query('user') user: string) {
    return this.roleService.getRole(family, user);
  }
}