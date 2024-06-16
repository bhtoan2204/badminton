import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { ELASTICSEARCH_SERVICE } from 'apps/gateway/src/utils';
import { PackageComboService } from './packageCombo.service';
import { PackageComboController } from './packageCombo.controller';

@Module({
  imports: [RmqModule.register({ name: ELASTICSEARCH_SERVICE })],
  controllers: [PackageComboController],
  providers: [PackageComboService],
})
export class PackageComboModule {}
