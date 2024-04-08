import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { GuidelineService } from "./guideline.service";
import { CurrentUser } from "../utils";
import { CreateGuidelineDto } from "./dto/createGuideline.dto";
import { UpdateGuidelineDto } from "./dto/updateGuideline.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageFileInterceptor } from "../user/interceptor/imageFile.interceptor";

@ApiTags('Guideline')
@Controller('guideline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GuidelineController {
  constructor(private readonly guidelineService: GuidelineService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all guideline' })
  @Get('getAllGuideline/:id_family')
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  @ApiParam({ name: 'id_family', required: true, description: 'The ID of the family' })
  async getAllGuideline(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('page') page: string,
    @Query('itemsPerPage') itemsPerPage: string
  ) {
    return this.guidelineService.getAllGuideline(currentUser.id_user, id_family, page, itemsPerPage);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get guideline detail' })
  @Get('getGuideline/:id_family/:id_guideline')
  @ApiParam({ name: 'id_family', required: true, description: 'The ID of the family' })
  @ApiParam({ name: 'id_guideline', required: true, description: 'The ID of the guideline' })
  async getGuideline(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_guideline') id_guideline: number) {
    return this.guidelineService.getGuideline(currentUser.id_user, id_family, id_guideline);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a guideline' })
  @Post('createGuideline')
  async createGuideline(@CurrentUser() currentUser, @Body() dto: CreateGuidelineDto) {
    return this.guidelineService.createGuideline(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a guideline' })
  @Put('updateGuideline')
  async updateGuideline(@CurrentUser() currentUser, @Body() dto: UpdateGuidelineDto) {
    return this.guidelineService.updateGuideline(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a guideline' })
  @Delete('deleteGuideline/:id_family/:id_guideline')
  async deleteGuideline(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_guideline') id_guideline: number) {
    return this.guidelineService.deleteGuideline(currentUser.id_user, id_family, id_guideline);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get step' })
  @Get('getStep/:id_family/:id_guideline')
  @ApiParam({ name: 'id_family', required: true, description: 'The ID of the family' })
  @ApiParam({ name: 'id_guideline', required: true, description: 'The ID of the guideline' })
  async getStep(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_guideline') id_guideline: number) {
    return this.guidelineService.getStep(currentUser.id_user, id_family, id_guideline);
  }

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
          type: 'number',
          description: 'The ID of the family',
        },
        id_guideline: {
          type: 'number',
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
      required: ["id_family", "id_guideline", "name"],
    },
  })
  @UseInterceptors(FileInterceptor('stepImage', new ImageFileInterceptor().createMulterOptions()))
  @Post('addStep')
  async addStep(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    dto.id_family = parseInt(dto.id_family);
    dto.id_guideline = parseInt(dto.id_guideline);
    return this.guidelineService.addStep(currentUser.id_user, dto, file);
  }

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
          type: 'number',
          description: 'The ID of the family',
        },
        id_guideline: {
          type: 'number',
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
          type: 'number',
          description: 'The index of the step',
        }
      },
      required: ["id_family", "id_guideline", "name", "index"],
    },
  })
  @UseInterceptors(FileInterceptor('stepImage', new ImageFileInterceptor().createMulterOptions()))
  @Post('insertStep')
  async insertStep(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    dto.id_family = parseInt(dto.id_family);
    dto.id_guideline = parseInt(dto.id_guideline);
    dto.index = parseInt(dto.index);
    return this.guidelineService.insertStep(currentUser.id_user, dto, file);
  }

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
          type: 'number',
          description: 'The ID of the family',
        },
        id_guideline: {
          type: 'number',
          description: 'The ID of the guideline',
        },
        index: {
          type: 'number',
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
      required: ["id_family", "id_guideline", "index", "name"],
    },
  })
  @UseInterceptors(FileInterceptor('stepImage', new ImageFileInterceptor().createMulterOptions()))
  @Put('updateStep')
  async updateStep(@CurrentUser() currentUser, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    if (!file && !dto.name && !dto.description) {
      throw new HttpException('At least one field (image, name, description) must be filled', HttpStatus.BAD_REQUEST);
    }
    dto.id_family = parseInt(dto.id_family);
    dto.id_guideline = parseInt(dto.id_guideline);
    dto.index = parseInt(dto.index);
    return this.guidelineService.updateStep(currentUser.id_user, dto, file);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete step' })
  @Delete('deleteStep/:id_family/:id_guideline/:index')
  async deleteStep(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_guideline') id_guideline: number, @Param('index') index: number) {
    return this.guidelineService.deleteStep(currentUser.id_user, id_family, id_guideline, index);
  }
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark shared' })
  @Put('markShared/:id_family/:id_guideline')
  async markShared(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_guideline') id_guideline: number) {
    return this.guidelineService.markShared(currentUser.id_user, id_family, id_guideline);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shared guideline' })
  @Get('getSharedGuideline')
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  @ApiQuery({ name: 'text', required: false, type: String })
  async getSharedGuideline(@CurrentUser() currentUser, @Query('page') page: number, @Query('itemsPerPage') itemsPerPage: number, @Query('text') text: string) {
    return this.guidelineService.getSharedGuideline(currentUser.id_user, page, itemsPerPage, text);
  }
}