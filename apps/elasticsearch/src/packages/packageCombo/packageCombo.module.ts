import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageCombo, PackageExtra, RmqModule } from '@app/common';
import { PackageComboController } from './packageCombo.controller';
import { PackageComboService } from './packageCombo.service';

@Module({
  imports: [RmqModule, TypeOrmModule.forFeature([PackageCombo, PackageExtra])],
  controllers: [PackageComboController],
  providers: [PackageComboService],
})
export class PackageComboModule {}
