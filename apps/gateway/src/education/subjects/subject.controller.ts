import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../../utils";
import { CreateSubjectDto } from "./dto/createSubject.dto";
import { SubjectService } from "./subject.service";
import { UpdateSubjectDto } from "./dto/updateSubject.dto";
import { AddComponentScoreDto } from "./dto/addComponentScore.dto";
import { UpdateComponentScoreDto } from "./dto/updateComponentScore.dto";
import { DeleteComponentScoreDto } from "./dto/deleteComponentScore.dto";
import { ModifyScoreDto } from "./dto/modifyScore.dto";
import { RemoveScoreDto } from "./dto/removeScore.dto";
import { ChangeStatusSubjectDto } from "./dto/changeStatusSubject.dto";

@ApiTags('Subject')
@Controller('subject')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new subject' })
  @Post('create')
  async createSubject(@CurrentUser() currentUser, @Body() dto: CreateSubjectDto) {
    return this.subjectService.createSubject(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get detail of a subject' })
  @ApiQuery({ name: 'id_family', required: true, type: Number })
  @ApiQuery({ name: 'id_education_progress', required: true, type: String })
  @ApiQuery({ name: 'id_subject', required: true, type: String })
  @Get('getDetail')
  async getDetailSubject(@CurrentUser() currentUser, @Query('id_family') id_family, @Query('id_education_progress') id_education_progress, @Query('id_subject') id_subject) {
    return this.subjectService.getDetailSubject(currentUser.id_user, id_family, id_education_progress, id_subject);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update subject' })
  @Put('update')
  async updateDetailSubject(@CurrentUser() currentUser, @Body() dto: UpdateSubjectDto) {
    return this.subjectService.updateDetailSubject(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete subject' })
  @Delete('delete/:id_family/:id_education_progress/:id_subject')
  @ApiParam({ name: 'id_family', required: true, type: Number })
  @ApiParam({ name: 'id_education_progress', required: true, type: Number })
  @ApiParam({ name: 'id_subject', required: true, type: Number })
  async deleteSubject(@CurrentUser() user, @Param('id_family') id_family, @Param('id_education_progress') id_education_progress, @Param('id_subject') id_subject) {
    return this.subjectService.deleteSubject(user.id_user, id_family, id_education_progress, id_subject);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add component score' })
  @Post('addComponentScore')
  async addComponentScore(@CurrentUser() currentUser, @Body() dto: AddComponentScoreDto) {
    return this.subjectService.addComponentScore(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Insert component score' })
  @Post('insertComponentScore/:index')
  @ApiParam({ name: 'index', required: true, type: Number })
  async insertComponentScore(@CurrentUser() currentUser, @Body() preDto: AddComponentScoreDto, @Param('index') index: number) {
    const dto = { ...preDto, index }
    return this.subjectService.insertComponentScore(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update component score' })
  @Put('updateComponentScore')
  async updateComponentScore(@CurrentUser() currentUser, @Body() dto: UpdateComponentScoreDto) {
    return this.subjectService.updateComponentScore(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete component score' })
  @Delete('deleteComponentScore')
  async deleteComponentScore(@CurrentUser() currentUser, @Body() dto: DeleteComponentScoreDto) {
    return this.subjectService.deleteComponentScore(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modify midterm, final, bonus score' })
  @Put('modifyScore')
  async modifyScore(@CurrentUser() currentUser, @Body() dto: ModifyScoreDto) {
    return this.subjectService.modifyScore(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modify midterm, final, bonus score' })
  @Delete('removeScore')
  async removeScore(@CurrentUser() currentUser, @Body() dto: RemoveScoreDto) {
    return this.subjectService.removeScore(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change status' })
  @Put('changeStatus')
  async changeStatus(@CurrentUser() currentUser, @Body() dto: ChangeStatusSubjectDto) {
    return this.subjectService.changeStatus(currentUser.id_user, dto);
  }
}