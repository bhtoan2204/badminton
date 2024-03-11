import { Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
@ApiTags('Role')
@Controller('role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @HttpCode(HttpStatus.OK)
  @Get('getallrole')
  @UseGuards(JwtAuthGuard)
  async getallrole() {
    return this.roleService.getallRole();
  }

  @HttpCode(HttpStatus.OK)
  @Get('getrole')
  @UseGuards(JwtAuthGuard)
  async getrole(@Query('family') family: number, @Query('user') user: string) {
    return this.roleService.getRole(family, user);
  }
}