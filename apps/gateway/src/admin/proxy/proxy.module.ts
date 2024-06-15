import { forwardRef, Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { AdminModule } from '../admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
