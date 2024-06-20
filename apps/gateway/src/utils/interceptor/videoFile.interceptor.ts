import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Injectable()
export class VideoFileInterceptor implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter: (req, file, callback) => {
        const maxSizeInBytes = 1024 * 1024 * 100; // 100MB

        if (!file.originalname.match(/\.(mp4|avi|mkv|mov|wmv|flv|webm|m4v)$/)) {
          return callback(new Error('Only video files are allowed!'), false);
        }

        if (file.size > maxSizeInBytes) {
          return callback(new Error('File size too large!'), false);
        }
        callback(null, true);
      },
      storage: memoryStorage(),
    };
  }
}
