import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { GrpcModule } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Module({
  imports: [GrpcModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'STORAGE',
      useFactory: async (configService: ConfigService): Promise<Storage> => {
        return new Storage({
          projectId: configService.get<string>('GOOGLE_PROJECT_ID'),
          credentials: {
            client_email: configService.get<string>('GOOGLE_CLIENT_EMAIL'),
            private_key: configService
              .get<string>('GOOGLE_PRIVATE_KEY')
              .replace(/\\n/g, '\n'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class FilesModule {}
