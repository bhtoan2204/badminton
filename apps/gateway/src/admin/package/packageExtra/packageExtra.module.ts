import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { ELASTICSEARCH_SERVICE } from 'apps/gateway/src/utils';
import { PackageExtraService } from './packageExtra.service';
import { PackageExtraController } from './packageExtra.controller';

@Module({
  imports: [RmqModule.register({ name: ELASTICSEARCH_SERVICE })],
  controllers: [PackageExtraController],
  providers: [PackageExtraService],
})
export class PackageExtraModule {}
