import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FamilyService } from "./family.service";
import { CreateFamilyDto } from "./dto/createFamily.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { MemberFamilyDto } from "./dto/memberFamily.dto";
import { CurrentUser } from "../utils/decorator/current-user.decorator";
import { UpdateFamilyDTO } from "./dto/updateFamily.dto";
import { DeleteMemberDTO } from "./dto/deleteFamily.dto";

@ApiTags('Family')
@Controller('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a family' })
  @Get('getoneFamily')
  async getFamily(@Query('id_family') id_family: number, @CurrentUser() user) {
    return this.familyService.getFamily(user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a family' })
  @Post('createFamily')
  async createFamily(@CurrentUser() user, @Body() CreateFamilyDto: CreateFamilyDto) {
    return this.familyService.createFamily(user,CreateFamilyDto);
  }
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('updateFamily')
  async updateFamily(@CurrentUser() user, @Body() CreateFamilyDto: UpdateFamilyDTO) {
    return this.familyService.updateFamily(user, CreateFamilyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('deleteFamily')
  async deleteFamily(@Query('id_family') id_family: number, @CurrentUser() user) {
    return this.familyService.deleteFamily(user, id_family);
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add member' })
  @Post('addMember')
  async addMember(@CurrentUser() user, @Body() data: MemberFamilyDto) {
    return this.familyService.addMember(user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete member' })
  @Delete('delete-member')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@CurrentUser() CurrentUser,@Body() member: DeleteMemberDTO) {
    return this.familyService.deleteMember(CurrentUser,member);
  }
}