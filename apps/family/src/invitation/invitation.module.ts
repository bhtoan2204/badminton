import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import {
  DatabaseModule,
  Family,
  FamilyExtraPackages,
  FamilyRoles,
  MemberFamily,
  PackageExtra,
  RmqModule,
  Users,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    DatabaseModule,
    RmqModule,
    TypeOrmModule.forFeature([
      Family,
      PackageExtra,
      FamilyExtraPackages,
      MemberFamily,
      FamilyRoles,
      Users,
    ]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
