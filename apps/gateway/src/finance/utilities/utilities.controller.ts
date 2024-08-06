import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FINANCE,
} from '../../utils';
import { UtilitiesService } from './utilities.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../../utils/interceptor/imageFile.interceptor';
import { GetUtilitiesDto } from './dto/getUtilities.dto';

@ApiTags('Utilities')
@Controller('utilities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
@Permission([PERMISSION_FINANCE])
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get utility types' })
  @Get('getUtilityTypes')
  async getUtilityTypes() {
    return this.utilitiesService.getUtilityTypes();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get utilities' })
  @Get('getUtilities')
  async getUtilities(
    @CurrentUser() currentUser,
    @Query() dto: GetUtilitiesDto,
  ) {
    return this.utilitiesService.getUtilities(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get one utility' })
  @ApiParam({ name: 'id_family', required: true, type: Number })
  @ApiParam({ name: 'id_utility', required: true, type: Number })
  @Get('getUtility/:id_family/:id_utility')
  async getUtility(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_utility') id_utility: number,
  ) {
    return this.utilitiesService.getUtility(
      currentUser.id_user,
      id_family,
      id_utility,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create utility' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_family: {
          type: 'number',
          description: 'The ID of the family',
        },
        id_utilities_type: {
          type: 'number',
          description: 'The ID of the utility type',
        },
        value: {
          type: 'number',
          description: 'The value of the utility',
        },
        name: {
          type: 'string',
          description: 'Name of the utility',
        },
        description: {
          type: 'string',
          description: 'Description of the utility',
        },
        utilityImg: { type: 'string', format: 'binary' },
      },
      required: ['id_family', 'id_utilities_type', 'value', 'name'],
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'utilityImg',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Post('createUtility')
  async createUtility(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.utilitiesService.createUtility(currentUser.id_user, dto, file);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update utility' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_utility: {
          type: 'number',
          description: 'The ID of the utility',
        },
        id_family: {
          type: 'number',
          description: 'The ID of the family',
        },
        id_utilities_type: {
          type: 'number',
          description: 'The ID of the utility type',
        },
        value: {
          type: 'number',
          description: 'The value of the utility',
        },
        name: {
          type: 'string',
          description: 'Name of the utility',
        },
        description: {
          type: 'string',
          description: 'Description of the utility',
        },
        utilityImg: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'utilityImg',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Put('updateUtility')
  async updateUtility(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.utilitiesService.updateUtility(currentUser.id_user, dto, file);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete utility' })
  @Delete('deleteUtility/:id_family/:id_utility')
  @ApiParam({ name: 'id_family', required: true, type: Number })
  @ApiParam({ name: 'id_utility', required: true, type: Number })
  async deleteUtility(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_utility') id_utility: number,
  ) {
    return this.utilitiesService.deleteUtility(
      currentUser.id_user,
      id_family,
      id_utility,
    );
  }
}
