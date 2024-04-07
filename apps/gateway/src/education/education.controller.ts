import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils";
import { EducationService } from "./education.service";
import { CreateEducationDto } from "./dto/createEducation.dto";

@ApiTags('Education')
@Controller('education')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(
    private readonly educationService: EducationService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all education progress' })
  @Post('create')
  async createEducationProgress(@CurrentUser() currentUser, @Body() dto: CreateEducationDto) {
    return this.educationService.createEducationProgress(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all education progress' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  @ApiQuery({ name: 'id_family', required: true, type: Number })
  @Get('getAll')
  async getAllEducationProgress(@CurrentUser() currentUser, @Query('page') page, @Query('itemsPerPage') itemsPerPage, @Query('id_family') id_family) {
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPageNumber = parseInt(itemsPerPage, 10) || 10;
    return this.educationService.getAllEducationProgress(currentUser.id_user, pageNumber, itemsPerPageNumber, id_family);
    
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all education progress' })
  @ApiParam({ name: 'id_family', required: true, type: Number })
  @ApiParam({ name: 'id_education_progress', required: true, type: Number })
  @Get('getDetail/:id_family/:id_education_progress')
  async getDetailEducationProgress(@CurrentUser() currentUser, @Param('id_family') id_family, @Param('id_education_progress') id_education_progress) {
    return this.educationService.getDetailEducationProgress(currentUser.id_user, id_family, id_education_progress);

  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update education progress' })
  @Put('update/:id_education_progress')
  async updateDetailEducationProgress(@CurrentUser() currentUser) {

  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete education progress' })
  @Put('delete/:id_education_progress')
  async deleteEducationProgress(@CurrentUser() currentUser) {

  }
}