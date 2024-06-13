import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, MemberFamilyGuard } from '../../utils';

@ApiTags('Calendar')
@Controller('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
export class CalendarController {}
