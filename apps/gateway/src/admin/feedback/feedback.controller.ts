import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';

@ApiTags('Admin Feedback')
@Controller('feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @HttpCode(HttpStatus.OK)
  @Get('getStatistics')
  async getAllFeedback() {
    return this.feedbackService.getCountAndAverageRatingFeedback();
  }

  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortDesc', required: false, type: Boolean })
  @Get()
  async getFeedback(@Query() query: any) {
    return this.feedbackService.getFeedback(
      query.page,
      query.itemsPerPage,
      query.search,
      query.sortBy,
      query.sortDesc,
    );
  }
}
