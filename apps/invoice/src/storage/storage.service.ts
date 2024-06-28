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

  async uploadImageInvoice(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> {
    return await lastValueFrom(this.storageService.uploadImageInvoice(request));
  }

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    return await lastValueFrom(this.storageService.readFile(request));
  }

  async deleteImageInvoice(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> {
    return await lastValueFrom(this.storageService.deleteImageInvoice(request));
  }

  async uploadImageUtility(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> {
    return await lastValueFrom(this.storageService.uploadImageUtility(request));
  }

  async deleteImageUtility(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> {
    return await lastValueFrom(this.storageService.deleteImageUtility(request));
  }
}
