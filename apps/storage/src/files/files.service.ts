import { Injectable } from '@nestjs/common';

import { DownloadResponse, Storage } from "@google-cloud/storage";
import { ConfigService } from '@nestjs/config';
import { UploadFileResponse } from '@app/common';
@Injectable()
export class FilesService {
  private storage: Storage;
  private bucket: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.storage = new Storage({
      projectId: configService.get<string>('GOOLE_PROJECT_ID'),
      credentials: {
        client_email: configService.get<string>('GOOGLE_CLIENT_EMAIL'),
        private_key: configService.get<string>('GOOGLE_PRIVATE_KEY'),
      },
    });

    this.bucket = configService.get<string>('GOOGLE_MEDIA_BUCKET');
  }

  async uploadFile(path: string, contentType: string, media: Buffer,metadata: { [key: string]: string }[]): Promise<UploadFileResponse> {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    const file = this.storage.bucket(this.bucket).file(path);
    const stream = file.createWriteStream();
    stream.on("finish", async () => {
      return await file.setMetadata({
        metadata: object,
      });
    });
    stream.end(media);

    return await new Promise<UploadFileResponse>((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', () => {
        resolve({
          fileName: "test.txt",
          fileUrl: `https://storage.googleapis.com/${this.bucket}/${path}`,
          message: "success",
        });
      });
    });
  }

  readFile(request: any) {
    throw new Error('Method not implemented.');
  }
  deleteFile(request: any) {
    throw new Error('Method not implemented.');
  }
}
