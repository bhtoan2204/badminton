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
    const id_user = currentUser.id_user;

    return this.familyService.getAllFamily(id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lay thong tin cua 1 family, sau khi current-user chon family bat ki' })
  @Get('getFamily')
  @UseGuards(JwtAuthGuard)
  async getFamily(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    const id_user = currentUser.id_user;

    return this.familyService.getFamily(id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a family' })
  @Post('createFamily')
  @UseGuards(JwtAuthGuard)
  async createFamily(@CurrentUser() currentUser, @Body() createFamilyDto: CreateFamilyDto) {
    const id_user = currentUser.id_user;

    return this.familyService.createFamily(id_user, createFamilyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('updateFamily')
  @UseGuards(JwtAuthGuard)
  async updateFamily(@CurrentUser() currentUser, @Body() UpdateFamilyDTO: UpdateFamilyDTO) {
    const id_user = currentUser.id_user;

    return this.familyService.updateFamily(id_user, UpdateFamilyDTO);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('deleteFamily')
  @UseGuards(JwtAuthGuard)
  async deleteFamily(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    const id_user = currentUser.id_user;

    return this.familyService.deleteFamily(id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all member infomation of specified family' })
  @Get('getAllMember')
  @UseGuards(JwtAuthGuard)
  async getAllMember(@Query('id_family') id_family: number, @CurrentUser() currentUser) {
    const id_user = currentUser.id_user;

    return this.familyService.getAllMember(id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get information of specified member' })
  @Get('getMember')
  @UseGuards(JwtAuthGuard)
  async getMember(@Query('id_user') id_user: string) {
    return this.familyService.getMember( id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add member' })
  @Post('addMember')
  @UseGuards(JwtAuthGuard)
  async addMember(@CurrentUser() currentUser, @Body() data: MemberFamilyDto) {
    const id_user = currentUser.id_user;

    return this.familyService.addMember(id_user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete member' })
  @Delete('deleteMember')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@CurrentUser() currentUser, @Body() member: DeleteMemberDTO) {
    const id_user = currentUser.id_user;

    return this.familyService.deleteMember(id_user, member);
  }
}