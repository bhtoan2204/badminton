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
  ApiTags,
} from '@nestjs/swagger';
import { FamilyService } from './family.service';
import { CurrentUser, JwtAuthGuard, MemberFamilyGuard } from '../utils';
import { CreateFamilyDto } from './dto/createFamily.dto';
import { MemberFamilyDto } from './dto/memberFamily.dto';
import { DeleteMemberDTO } from './dto/deleteFamily.dto';
import { UpdateFamilyDTO } from './dto/updateFamily.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../utils/interceptor/imageFile.interceptor';

@ApiTags('Family')
@Controller('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
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

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a family' })
  @Post('createFamily')
  async createFamily(
    @CurrentUser() currentUser,
    @Body() createFamilyDto: CreateFamilyDto,
  ) {
    return this.familyService.createFamily(
      currentUser.id_user,
      createFamilyDto,
    );
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('deleteFamily')
  async deleteFamily(
    @Query('id_family') id_family: number,
    @CurrentUser() currentUser,
  ) {
    return this.familyService.deleteFamily(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all member infomation of specified family' })
  @Get('getAllMember')
  async getAllMember(
    @Query('id_family') id_family: number,
    @CurrentUser() currentUser,
  ) {
    return this.familyService.getAllMember(currentUser.id_user, id_family);
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete member' })
  @Delete('deleteMember')
  async deleteMember(
    @CurrentUser() currentUser,
    @Body() member: DeleteMemberDTO,
  ) {
    return this.familyService.deleteMember(currentUser.id_user, member);
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
}
