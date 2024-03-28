import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FamilyService } from "./family.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils";
import { CreateFamilyDto } from "./dto/createFamily.dto";
import { MemberFamilyDto } from "./dto/memberFamily.dto";
import { DeleteMemberDTO } from "./dto/deleteFamily.dto";
import { UpdateFamilyDTO } from "./dto/updateFamily.dto";

@ApiTags('Family')
@Controller('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FamilyController {
  constructor(private readonly familyService: FamilyService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all family' })
  @Get('getAllFamily')
  async getAllFamily(@CurrentUser() currentUser) {
    return this.familyService.getAllFamily(currentUser.id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get family detail' })
  @Get('getFamily')
  async getFamily(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    return this.familyService.getFamily(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a family' })
  @Post('createFamily')
  async createFamily(@CurrentUser() currentUser, @Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.createFamily(currentUser.id_user, createFamilyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('updateFamily')
  async updateFamily(@CurrentUser() currentUser, @Body() UpdateFamilyDTO: UpdateFamilyDTO) {
    return this.familyService.updateFamily(currentUser.id_user, UpdateFamilyDTO);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('deleteFamily')
  async deleteFamily(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    return this.familyService.deleteFamily(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all member infomation of specified family' })
  @Get('getAllMember')
  async getAllMember(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    return this.familyService.getAllMember(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get information of specified member' })
  @Get('getMember')
  @UseGuards(JwtAuthGuard)
  async getMember(@Query('id_user') id_user: string) {
    return this.familyService.getMember(id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add member' })
  @Post('addMember')
  async addMember(@CurrentUser() currentUser, @Body() data: MemberFamilyDto) {
    return this.familyService.addMember(currentUser.id_user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete member' })
  @Delete('deleteMember')
  async deleteMember(@CurrentUser() currentUser, @Body() member: DeleteMemberDTO) {
    return this.familyService.deleteMember(currentUser.id_user, member);
  }
}