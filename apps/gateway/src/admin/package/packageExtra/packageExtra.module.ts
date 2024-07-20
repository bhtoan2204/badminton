import { Module } from '@nestjs/common';
import { PackageExtraService } from './packageExtra.service';
import { PackageExtraController } from './packageExtra.controller';

@Module({
  imports: [],
  controllers: [PackageExtraController],
  providers: [PackageExtraService],
})
export class PackageExtraModule {}
