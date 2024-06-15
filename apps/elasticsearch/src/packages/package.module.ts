import { forwardRef, Module } from '@nestjs/common';
import { PackageMainModule } from './packageMain/packageMain.module';

@Module({
  imports: [forwardRef(() => PackageMainModule)],
  exports: [PackageModule],
})
export class PackageModule {}
