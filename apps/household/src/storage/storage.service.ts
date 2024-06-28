import {
  DeleteFileRequest,
  DeleteFileResponse,
  ReadFileRequest,
  ReadFileResponse,
  STORAGE_SERVICE_NAME,
  StorageServiceClient,
  UploadFileRequest,
  UploadFileResponse,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StorageService implements OnModuleInit {
  private storageService: StorageServiceClient;

  constructor(@Inject('STORAGE') private storageClient: ClientGrpc) {}

  onModuleInit() {
    this.storageService =
      this.storageClient.getService<StorageServiceClient>(STORAGE_SERVICE_NAME);
  }

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    return await lastValueFrom(this.storageService.readFile(request));
  }

  async uploadImageHousehold(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> {
    return await lastValueFrom(
      this.storageService.uploadImageHousehold(request),
    );
  }

  async deleteImageHousehold(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> {
    return await lastValueFrom(
      this.storageService.deleteImageHousehold(request),
    );
  }

  async uploadImageRoom(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> {
    return await lastValueFrom(this.storageService.uploadImageRoom(request));
  }

  async deleteImageRoom(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> {
    return await lastValueFrom(this.storageService.deleteImageRoom(request));
  }
}
