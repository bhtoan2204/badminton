import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { GrpcModule } from '@app/common';

@Module({
  imports: [
    FilesModule,
    GrpcModule.register({ name: 'STORAGE' }),
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
