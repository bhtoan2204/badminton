import { Module } from '@nestjs/common';
import { PackageMainController } from './packageMain.controller';
import { PackageMainService } from './packageMain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageMain, RmqModule } from '@app/common';

@Module({
  imports: [RmqModule, TypeOrmModule.forFeature([PackageMain])],
  controllers: [PackageMainController],
  providers: [PackageMainService],
})
export class PackageMainModule {}
