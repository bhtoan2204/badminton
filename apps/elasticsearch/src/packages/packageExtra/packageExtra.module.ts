import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageExtra, RmqModule } from '@app/common';
import { PackageExtraController } from './packageExtra.controller';
import { PackageExtraService } from './packageExtra.service';

@Module({
  imports: [RmqModule, TypeOrmModule.forFeature([PackageExtra])],
  controllers: [PackageExtraController],
  providers: [PackageExtraService],
})
export class PackageExtraModule {}
