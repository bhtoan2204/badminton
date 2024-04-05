import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
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
  @Get('getAll')
  async getAllEducationProgress(@CurrentUser() currentUser) {

  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all education progress' })
  @Get('getDetail/:id_education_progress')
  async getDetailEducationProgress(@CurrentUser() currentUser) {

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