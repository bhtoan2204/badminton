import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from '../admin.module';
import { PackageMainModule } from './packageMain/packageMain.module';

@Module({
  imports: [forwardRef(() => AdminModule), forwardRef(() => PackageMainModule)],
  exports: [PackageModule],
})
export class PackageModule {}
