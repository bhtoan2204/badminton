import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../../utils";
import { CreateSubjectDto } from "./dto/createSubject.dto";
import { SubjectService } from "./subject.service";

@ApiTags('Subject')
@Controller('subject')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation ({ summary: 'Create a new subject' })
  @Post('create')
  async createSubject(@CurrentUser() currentUser, @Body() dto: CreateSubjectDto) {
    return this.subjectService.createSubject(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation ({ summary: 'Get detail of a subject' })
  @ApiQuery({ name: 'id_family', required: true, type: Number })
  @ApiQuery({ name: 'id_education_progress', required: true, type: String })
  @ApiQuery({ name: 'id_subject', required: true, type: String })
  @Get('getDetail')
  async getDetailSubject(@CurrentUser() currentUser, @Query('id_family') id_family, @Query('id_education_progress') id_education_progress, @Query('id_subject') id_subject) {
    return this.subjectService.getDetailSubject(currentUser.id_user, id_family, id_education_progress, id_subject);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation ({ summary: 'Update subject' })
  @Put('update')
  async updateDetailSubject() {

  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation ({ summary: 'Delete subject' })
  @Put('delete')
  async deleteSubject() {
    
  }
}