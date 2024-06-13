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
    return this.storageService.uploadImageExpense(request).toPromise();
  }

  async deleteImageExpense(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> {
    return this.storageService.deleteImageExpense(request).toPromise();
  }

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    return this.storageService.readFile(request).toPromise();
  }
}
