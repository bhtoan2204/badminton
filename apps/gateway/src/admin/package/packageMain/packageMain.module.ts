import { Module } from '@nestjs/common';
import { PackageMainController } from './packageMain.controller';
import { PackageMainService } from './packageMain.service';

@Module({
  imports: [],
  controllers: [PackageMainController],
  providers: [PackageMainService],
})
export class PackageMainModule {}
