import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from '../admin.module';
import { PackageMainModule } from './packageMain/packageMain.module';
import { PackageExtraModule } from './packageExtra/packageExtra.module';
import { PackageComboModule } from './packageCombo/packageCombo.module';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    forwardRef(() => PackageMainModule),
    forwardRef(() => PackageExtraModule),
    forwardRef(() => PackageComboModule),
  ],
  exports: [PackageModule],
})
export class PackageModule {}
