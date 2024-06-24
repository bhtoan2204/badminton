import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../utils';
import { CreateFeedbackDto } from './dto/createFeedback.dto';

@ApiTags('Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create feedback' })
  @Post()
  async createFeedback(
    @CurrentUser() user: any,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.feedbackService.createFeedback(user.id_user, dto);
  }
}
