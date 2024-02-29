import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { GrpcModule } from '@app/common';

@Module({
  imports: [GrpcModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
