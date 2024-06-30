import { Module } from '@nestjs/common';
import { SerperService } from './serper.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [SerperService],
  exports: [SerperService],
})
export class SerperModule {}
