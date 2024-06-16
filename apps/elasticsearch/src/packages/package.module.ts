import { forwardRef, Module } from '@nestjs/common';
import { PackageMainModule } from './packageMain/packageMain.module';
import { PackageExtraModule } from './packageExtra/packageExtra.module';
import { PackageComboModule } from './packageCombo/packageCombo.module';

@Module({
  imports: [
    forwardRef(() => PackageMainModule),
    forwardRef(() => PackageExtraModule),
    forwardRef(() => PackageComboModule),
  ],
  exports: [PackageModule],
})
export class PackageModule {}
