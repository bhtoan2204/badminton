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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_INVOICE,
} from '../../utils';
import { UtilitiesService } from './utilities.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../../utils/interceptor/imageFile.interceptor';

@ApiTags('Utilities')
@Controller('utilities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
@Permission([PERMISSION_INVOICE])
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
  @ApiParam({ name: 'id_family', required: true, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @Get('getUtilities/:id_family')
  async getUtilities(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    return this.utilitiesService.getUtilities(
      currentUser.id_user,
      id_family,
      page,
      itemsPerPage,
    );
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
