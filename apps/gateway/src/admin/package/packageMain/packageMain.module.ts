import { Module } from '@nestjs/common';
import { PackageMainController } from './packageMain.controller';
import { PackageMainService } from './packageMain.service';
import { RmqModule } from '@app/common';
import { ELASTICSEARCH_SERVICE } from 'apps/gateway/src/utils';

@Module({
  imports: [RmqModule.register({ name: ELASTICSEARCH_SERVICE })],
  controllers: [PackageMainController],
  providers: [PackageMainService],
})
export class PackageMainModule {}
