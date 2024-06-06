import { Module, forwardRef } from '@nestjs/common';
import { SearchModule } from '../elasticsearch.module';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, forwardRef(() => SearchModule)],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
