import { GrpcModule } from '@app/common';
import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  imports: [GrpcModule.register({ name: 'STORAGE' })],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
