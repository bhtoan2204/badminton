import { Module } from '@nestjs/common';
import { PackageMainController } from './packageMain.controller';
import { PackageMainService } from './packageMain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Checklist,
  Family,
  FamilyExtraPackages,
  PackageCombo,
  PackageExtra,
  PackageMain,
  RmqModule,
  Users,
} from '@app/common';

@Module({
  imports: [
    RmqModule,
    TypeOrmModule.forFeature([
      Checklist,
      Family,
      Users,
      FamilyExtraPackages,
      PackageCombo,
      PackageExtra,
      PackageMain,
    ]),
  ],
  controllers: [PackageMainController],
  providers: [PackageMainService],
})
export class PackageMainModule {}
