import { Module } from '@nestjs/common';
import { DocumentaiService } from './documentai.service';

@Module({
  providers: [DocumentaiService],
  exports: [DocumentaiService],
})
export class DocumentaiModule {}
