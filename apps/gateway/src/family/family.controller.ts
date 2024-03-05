import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FamilyService } from "./family.service";
import { CreateFamilyDto } from "./dto/createFamilyDto.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "apps/gateway/decorator/current-user.decorator";
import { DeleteMemberDTO } from "./dto/delete-familydto.dto"; 
import { MemberFamilyDto } from "./dto/memberFamilyDto.dto";
@ApiTags('Family')
@Controller('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)

export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a family' })
  @Get('get-family')
  @UseGuards(JwtAuthGuard)
  async getFamily(@CurrentUser() user) {
    return this.familyService.getFamily(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a family' })
  @Post('create-family')
  @UseGuards(JwtAuthGuard)
  async createFamily(@CurrentUser() user, @Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.createFamily(user,createFamilyDto);
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('update-family')
  @UseGuards(JwtAuthGuard)
  async updateFamily(@CurrentUser() user, @Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.updateFamily(user,createFamilyDto);
  }


  @HttpCode(HttpStatus.OK)// trar veef code
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('delete-family')
  @UseGuards(JwtAuthGuard)
  async deleteFamily(@CurrentUser() user) {
    return this.familyService.deleteFamily(user);
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add member' })
  @Post('add-member')
  @UseGuards(JwtAuthGuard)
  async addMember(@CurrentUser() user, @Body() data: MemberFamilyDto) {
    return this.familyService.addMember(user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete member' })
  @Delete('delete-member')
  async deleteMember(@Body() member: DeleteMemberDTO) {
    return this.familyService.deleteMember(member);
  }

  
}