import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards , Param} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FamilyService } from "./family.service";
import { CreateFamilyDto } from "./dto/createFamilyDto.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "apps/gateway/decorator/current-user.decorator";
import { DeleteMemberDTO } from "./dto/delete-familydto.dto"; 
import { MemberFamilyDto } from "./dto/memberFamilyDto.dto";
import { UpdateFamilyDTO } from "./dto/update-familyDTO.dto";
@ApiTags('Family')
@Controller('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)

export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lay thong tin tat ca cac family của current-user' })
  @Get('get-all-family')
  @UseGuards(JwtAuthGuard)
  async GetAllFamily(@CurrentUser() user) {
    return this.familyService.GetAllFamily(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lay thong tin cua 1 family, sau khi current-user chon family bat ki' })
  @Get('get-family')
  @UseGuards(JwtAuthGuard)
  async getFamily(@Query('id_family') id_family: number, @CurrentUser() CurrentUser) {
    return this.familyService.getFamily(CurrentUser, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a family' })
  @Post('create-family')
  @UseGuards(JwtAuthGuard)
  async createFamily(@CurrentUser() CurrentUser, @Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.createFamily(CurrentUser,createFamilyDto);
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('update-family')
  @UseGuards(JwtAuthGuard)
  async updateFamily(@CurrentUser() CurrentUser,@Body() UpdateFamilyDTO: UpdateFamilyDTO) {
    return this.familyService.updateFamily(CurrentUser,UpdateFamilyDTO);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('delete-family')
  @UseGuards(JwtAuthGuard)
  async deleteFamily(@Query('id_family') id_family: number,  @CurrentUser() currentUser: any) {
    return this.familyService.deleteFamily(currentUser, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add member' })
  @Post('add-member')
  @UseGuards(JwtAuthGuard)
  async addMember(@CurrentUser() CurrentUser,@Body() data: MemberFamilyDto) {
    return this.familyService.addMember(CurrentUser, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete member' })
  @Delete('delete-member')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@CurrentUser() CurrentUser,@Body() member: DeleteMemberDTO) {
    return this.familyService.deleteMember(CurrentUser,member);
  }

  
}