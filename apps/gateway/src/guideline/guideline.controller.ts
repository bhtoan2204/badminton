import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
import { GuidelineService } from './guideline.service';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_GUIDELINE,
} from '../utils';
import { CreateGuidelineDto } from './dto/createGuideline.dto';
import { UpdateGuidelineDto } from './dto/updateGuideline.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../utils/interceptor/imageFile.interceptor';

@ApiTags('Guideline')
@Controller('guideline')
@ApiBearerAuth()
export class GuidelineController {
  constructor(private readonly guidelineService: GuidelineService) {}

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all guideline' })
  @Get('getAllGuideline/:id_family')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: Number })
  @ApiParam({
    name: 'id_family',
    required: true,
    description: 'The ID of the family',
  })
  async getAllGuideline(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    return this.guidelineService.getAllGuideline(
      currentUser.id_user,
      id_family,
      page,
      itemsPerPage,
    );
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get guideline detail' })
  @Get('getGuideline/:id_family/:id_guideline')
  @ApiParam({
    name: 'id_family',
    required: true,
    description: 'The ID of the family',
  })
  @ApiParam({
    name: 'id_guideline',
    required: true,
    description: 'The ID of the guideline',
  })
  async getGuideline(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_guideline') id_guideline: number,
  ) {
    return this.guidelineService.getGuideline(
      currentUser.id_user,
      id_family,
      id_guideline,
    );
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a guideline' })
  @Post('createGuideline')
  async createGuideline(
    @CurrentUser() currentUser,
    @Body() dto: CreateGuidelineDto,
  ) {
    return this.guidelineService.createGuideline(currentUser.id_user, dto);
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a guideline' })
  @Put('updateGuideline')
  async updateGuideline(
    @CurrentUser() currentUser,
    @Body() dto: UpdateGuidelineDto,
  ) {
    return this.guidelineService.updateGuideline(currentUser.id_user, dto);
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a guideline' })
  @Delete('deleteGuideline/:id_family/:id_guideline')
  async deleteGuideline(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_guideline') id_guideline: number,
  ) {
    return this.guidelineService.deleteGuideline(
      currentUser.id_user,
      id_family,
      id_guideline,
    );
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get step' })
  @Get('getStep/:id_family/:id_guideline')
  @ApiParam({
    name: 'id_family',
    required: true,
    description: 'The ID of the family',
  })
  @ApiParam({
    name: 'id_guideline',
    required: true,
    description: 'The ID of the guideline',
  })
  async getStep(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_guideline') id_guideline: number,
  ) {
    return this.guidelineService.getStep(
      currentUser.id_user,
      id_family,
      id_guideline,
    );
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add step' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stepImage: {
          type: 'string',
          format: 'binary',
          description: 'The image of the step (optional)',
        },
        id_family: {
          type: 'string',
          description: 'The ID of the family',
        },
        id_guideline: {
          type: 'string',
          description: 'The ID of the guideline',
        },
        name: {
          type: 'string',
          description: 'The title of the step',
        },
        description: {
          type: 'string',
          description: 'The description of the step (optional)',
        },
      },
      required: ['id_family', 'id_guideline', 'name'],
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'stepImage',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Post('addStep')
  async addStep(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    dto.id_family = parseInt(dto.id_family);
    dto.id_guideline = parseInt(dto.id_guideline);
    return this.guidelineService.addStep(currentUser.id_user, dto, file);
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Insert step' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stepImage: {
          type: 'string',
          format: 'binary',
          description: 'The image of the step (optional)',
        },
        id_family: {
          type: 'string',
          description: 'The ID of the family',
        },
        id_guideline: {
          type: 'string',
          description: 'The ID of the guideline',
        },
        name: {
          type: 'string',
          description: 'The title of the step',
        },
        description: {
          type: 'string',
          description: 'The description of the step (optional)',
        },
        index: {
          type: 'string',
          description: 'The index of the step',
        },
      },
      required: ['id_family', 'id_guideline', 'name', 'index'],
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'stepImage',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Post('insertStep')
  async insertStep(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    dto.id_family = parseInt(dto.id_family);
    dto.id_guideline = parseInt(dto.id_guideline);
    dto.index = parseInt(dto.index);
    return this.guidelineService.insertStep(currentUser.id_user, dto, file);
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update step' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stepImage: {
          type: 'string',
          format: 'binary',
          description: 'The image of the step (optional)',
        },
        id_family: {
          type: 'string',
          description: 'The ID of the family',
        },
        id_guideline: {
          type: 'string',
          description: 'The ID of the guideline',
        },
        index: {
          type: 'string',
          description: 'The index of the step',
        },
        name: {
          type: 'string',
          description: 'The title of the step',
        },
        description: {
          type: 'string',
          description: 'The description of the step (optional)',
        },
      },
      required: ['id_family', 'id_guideline', 'index', 'name'],
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'stepImage',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Put('updateStep')
  async updateStep(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file && !dto.name && !dto.description) {
      throw new HttpException(
        'At least one field (image, name, description) must be filled',
        HttpStatus.BAD_REQUEST,
      );
    }
    dto.id_family = parseInt(dto.id_family);
    dto.id_guideline = parseInt(dto.id_guideline);
    dto.index = parseInt(dto.index);
    return this.guidelineService.updateStep(currentUser.id_user, dto, file);
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete step' })
  @Delete('deleteStep/:id_family/:id_guideline/:index')
  async deleteStep(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_guideline') id_guideline: number,
    @Param('index') index: number,
  ) {
    return this.guidelineService.deleteStep(
      currentUser.id_user,
      id_family,
      id_guideline,
      index,
    );
  }

  @UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
  @Permission([PERMISSION_GUIDELINE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark shared' })
  @Put('markShared/:id_family/:id_guideline')
  async markShared(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_guideline') id_guideline: number,
  ) {
    return this.guidelineService.markShared(
      currentUser.id_user,
      id_family,
      id_guideline,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shared guideline' })
  @Get('getSharedGuideline')
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  @ApiQuery({ name: 'text', required: false, type: String })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    enum: ['asc', 'desc', 'none'],
    description: 'asc: ascending, desc: descending, none: no sort',
  })
  async getSharedGuideline(
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('text') text: string,
    @Query('sort') sort: 'asc' | 'desc' | 'none' = 'none',
  ) {
    return this.guidelineService.getSharedGuideline(
      page,
      itemsPerPage,
      text,
      sort,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shared guideline by ID' })
  @Get('getSharedGuidelineById/:id_guideline')
  @ApiParam({
    name: 'id_guideline',
    required: true,
    description: 'The ID of the guideline',
  })
  async getSharedGuidelineById(@Param('id_guideline') id_guideline: number) {
    return this.guidelineService.getSharedGuidelineById(id_guideline);
  }
}
