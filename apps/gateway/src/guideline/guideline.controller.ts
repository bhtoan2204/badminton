import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { GuidelineService } from "./guideline.service";
import { CurrentUser } from "../utils";
import { CreateGuidelineDto } from "./dto/createGuideline.dto";
import { UpdateGuidelineDto } from "./dto/updateGuideline.dto";
import { AddStepGuidelineDto } from "./dto/addStep.dto";
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
    ){
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
      required: ["id_family", "id_guideline", "title"],
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

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Update step' })
  // @Put('updateStep')
  // async updateStep(@CurrentUser() currentUser, @Body() dto: any) {
  //   return this.guidelineService.updateStep(currentUser.id_user, dto);
  // }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Delete step' })
  // @Delete('deleteStep/:id_family/:id_guideline/:id_step')
  // async deleteStep(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_guideline') id_guideline: number, @Param('id_step') id_step: number) {
  //   return this.guidelineService.deleteStep(currentUser.id_user, id_family, id_guideline, id_step);
  // }
}