import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FamilyService } from "./family.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils/decorator/current-user.decorator";
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
  @ApiOperation({ summary: 'Lay thong tin tat ca cac family của current-user' })
  @Get('getAllFamily')
  @UseGuards(JwtAuthGuard)
  async getAllFamily(@CurrentUser() currentUser) {
    return this.familyService.getAllFamily(currentUser.id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lay thong tin cua 1 family, sau khi current-user chon family bat ki' })
  @Get('get-family')
  @UseGuards(JwtAuthGuard)
  async getFamily(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    return this.familyService.getFamily(currentUser, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a family' })
  @Post('create-family')
  @UseGuards(JwtAuthGuard)
  async createFamily(@CurrentUser() currentUser, @Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.createFamily(currentUser, createFamilyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('update-family')
  @UseGuards(JwtAuthGuard)
  async updateFamily(@CurrentUser() currentUser, @Body() UpdateFamilyDTO: UpdateFamilyDTO) {
    return this.familyService.updateFamily(currentUser, UpdateFamilyDTO);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('delete-family')
  @UseGuards(JwtAuthGuard)
  async deleteFamily(@Query('id_family') id_family: number, @CurrentUser() currentUser: any) {
    return this.familyService.deleteFamily(currentUser, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all member infomation of specified family' })
  @Get('get-all-member')
  @UseGuards(JwtAuthGuard)
  async getAllMember(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    return this.familyService.getAllMember(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get information of specified member' })
  @Get('get-member')
  @UseGuards(JwtAuthGuard)
  async getMember(@Query('id_user') id_user: string, @CurrentUser() currentUser) {
    return this.familyService.getMember(currentUser, id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add member' })
  @Post('addMember')
  @UseGuards(JwtAuthGuard)
  async addMember(@CurrentUser() currentUser, @Body() data: MemberFamilyDto) {
    return this.familyService.addMember(currentUser.id_user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete member' })
  @Delete('delete-member')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@CurrentUser() currentUser, @Body() member: DeleteMemberDTO) {
    return this.familyService.deleteMember(currentUser, member);
  }
}