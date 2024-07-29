import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FamilyService } from './family.service';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
} from '../utils';
import { MemberFamilyDto } from './dto/memberFamily.dto';
import { UpdateFamilyDTO } from './dto/updateFamily.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../utils/interceptor/imageFile.interceptor';
import { AssignRoleDto } from './dto/assignRole.dto';

@ApiTags('Family')
@Controller('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all family' })
  @Get('getAllFamily')
  async getAllFamily(@CurrentUser() currentUser) {
    return this.familyService.getAllFamily(currentUser.id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get family detail' })
  @Get('getFamily')
  async getFamily(
    @Query('id_family') id_family: number,
    @CurrentUser() currentUser,
  ) {
    return this.familyService.getFamily(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('updateFamily')
  async updateFamily(
    @CurrentUser() currentUser,
    @Body() updateFamilyDTO: UpdateFamilyDTO,
  ) {
    return this.familyService.updateFamily(
      currentUser.id_user,
      updateFamilyDTO,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all member infomation of specified family' })
  @ApiQuery({ name: 'search', required: false })
  @Get('getAllMember')
  async getAllMember(
    @Query('id_family') id_family: number,
    @CurrentUser() currentUser,
    @Query('search') search: string,
  ) {
    return this.familyService.getAllMember(
      currentUser.id_user,
      id_family,
      search,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get information of specified member' })
  @Get('getMember')
  async getMember(@Query('id_user') id_user: string) {
    return this.familyService.getMember(id_user);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add member' })
  @Post('addMember')
  async addMember(@CurrentUser() currentUser, @Body() data: MemberFamilyDto) {
    return this.familyService.addMember(currentUser.id_user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change Avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' },
        id_family: { type: 'integer' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', new ImageFileInterceptor().createMulterOptions()),
  )
  @Put('changeAvatar')
  async changeAvatar(
    @CurrentUser() currentUser,
    @UploadedFile() file: Express.Multer.File,
    @Body('id_family') id_family: number,
  ) {
    return this.familyService.changeAvatar(
      currentUser.id_user,
      id_family,
      file,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Leave family' })
  @Delete('leaveFamily')
  async leaveFamily(
    @CurrentUser() currentUser,
    @Query('id_family') id_family: number,
  ) {
    return this.familyService.leaveFamily(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Kick member' })
  @Delete('kickMember')
  async kickMember(
    @CurrentUser() currentUser,
    @Query('id_user') id_user: string,
    @Query('id_family') id_family: number,
  ) {
    return this.familyService.kickMember(
      currentUser.id_user,
      id_user,
      id_family,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get family roles' })
  @Get('getFamilyRoles')
  async getFamilyRoles() {
    return this.familyService.getFamilyRoles();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign Family Role' })
  @Post('assignFamilyRole')
  async assignFamilyRole(
    @CurrentUser() currentUser,
    @Body() dto: AssignRoleDto,
  ) {
    return this.familyService.assignFamilyRole(dto);
  }
}
