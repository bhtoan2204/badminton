import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Injectable()
export class ImageFileInterceptor implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter: (req, file, callback) => {
        const maxSizeInBytes = 1024 * 1024 * 50; // 50MB

        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }

        if (file.size > maxSizeInBytes) {
          return callback(new Error('File size too large!'), false);
        }
        callback(null, true);
      },
      storage: memoryStorage()
    };
  }
}
