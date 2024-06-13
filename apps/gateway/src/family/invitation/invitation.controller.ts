import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FAMILY,
} from '../../utils';
import { InvitationService } from './invitation.service';

@ApiTags('Invitation')
@Controller('invitation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Permission([PERMISSION_FAMILY])
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(MemberFamilyGuard)
  @ApiOperation({ summary: 'Get invitation code' })
  @Get('getInvitationCode')
  async getInvitationCode(
    @Query('id_family') id_family: number,
    @CurrentUser() currentUser,
  ) {
    return this.invitationService.getInvitationCode(
      currentUser.id_user,
      id_family,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(MemberFamilyGuard)
  @ApiOperation({ summary: 'Generate invitation code' })
  @Get('generateInvitation')
  async generateInvitation(
    @Query('id_family') id_family: number,
    @CurrentUser() currentUser,
  ) {
    return this.invitationService.generateInvitation(
      currentUser.id_user,
      id_family,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle invitation' })
  @Get('handleInvitation')
  async handleInvitation(
    @Query('id_family') id_family: number,
    @Query('code') code: string,
    @CurrentUser() currentUser,
  ) {
    return this.invitationService.handleInvitation(
      currentUser.id_user,
      id_family,
      code,
    );
  }
}
