import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import {
  MainDatabaseModule,
  MemberFamily,
  RmqModule,
  FamilyInvitation,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MainDatabaseModule,
    RmqModule,
    TypeOrmModule.forFeature([MemberFamily, FamilyInvitation]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
