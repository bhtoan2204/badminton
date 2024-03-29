import { Inject, Injectable } from '@nestjs/common';
import { Storage } from "@google-cloud/storage";
import { ConfigService } from '@nestjs/config';
import { DeleteFileRequest, DeleteFileResponse, ReadFileRequest, ReadFileResponse, UploadFileRequest, UploadFileResponse } from '@app/common';
import { Buffer } from 'buffer';

@Injectable()
export class FilesService {
  private bucket: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject('STORAGE') private readonly storage: Storage
    ) {
    this.bucket = this.configService.get<string>('GOOGLE_MEDIA_BUCKET');
  }

  async uploadFile({ fileName, file }: { fileName: string; file: Uint8Array}, uploadType: string): Promise<UploadFileResponse> {
    try {
      const path = `${uploadType}/${fileName}`;
      const fileRef = this.storage.bucket(this.bucket).file(path);
      const contentType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
  
      return new Promise<UploadFileResponse>((resolve, reject) => {
        const stream = fileRef.createWriteStream({
          metadata: {
            contentType: contentType,
          },
        });
  
        stream.on('error', (err) => {
          console.log(err); 
          reject(err);
        });
        stream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucket}/${path}`;
          resolve({
            fileName: fileName,
            fileUrl: publicUrl,
            message: "File uploaded successfully",
          });
        });
        
        const buffer = Buffer.from(file instanceof Uint8Array ? file : new Uint8Array([]));
        stream.end(buffer);
      });
    } catch (e) {
      console.log(e.message); 
      throw e;
    }
  }
  

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    const { fileName, filePath } = request;
    const path = `${filePath}/${fileName}`;
    const fileRef = this.storage.bucket(this.bucket).file(path);
    const [fileContent] = await fileRef.download();
    const [metadata] = await fileRef.getMetadata();
    const mimeType = metadata.contentType;
    const base64Image = fileContent.toString('base64');

    return {
      fileName,
      fileContent: base64Image,
      message: "File read successfully",
      mimeType
    };
  }
  
  async deleteFile({ fileName }: DeleteFileRequest, uploadType: string): Promise<DeleteFileResponse> {
    try {
        const path = `${uploadType}/${fileName}`;
        const fileRef = this.storage.bucket(this.bucket).file(path);
        const [exists] = await fileRef.exists();
        if (!exists) {
            return {
                fileName: fileName,
                message: "File does not exist, nothing to delete",
            };
        }
        await fileRef.delete();
        return {
            fileName: fileName,
            message: "File deleted successfully",
        };
    } catch (e) {
        console.log(e.message);
        throw e;
    }
}

}
