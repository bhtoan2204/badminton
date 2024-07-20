import { Module } from '@nestjs/common';
import { PackageComboService } from './packageCombo.service';
import { PackageComboController } from './packageCombo.controller';

@Module({
  imports: [],
  controllers: [PackageComboController],
  providers: [PackageComboService],
})
export class PackageComboModule {}
