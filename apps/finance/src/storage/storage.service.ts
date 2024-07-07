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

  async uploadImageExpense(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> {
    return await lastValueFrom(this.storageService.uploadImageExpense(request));
  }

  async deleteImageExpense(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> {
    return await lastValueFrom(this.storageService.deleteImageExpense(request));
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

  async uploadImageAsset(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> {
    return await lastValueFrom(this.storageService.uploadImageAsset(request));
  }

  async deleteImageAsset(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> {
    return await lastValueFrom(this.storageService.deleteImageAsset(request));
  }

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    return await lastValueFrom(this.storageService.readFile(request));
  }
}
