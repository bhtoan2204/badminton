import { DeleteFileRequest, DeleteFileResponse, ReadFileRequest, ReadFileResponse, STORAGE_SERVICE_NAME, StorageServiceClient, UploadFileRequest, UploadFileResponse } from "@app/common";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { STORAGE_SERVICE } from "../utils/constants/service";

@Injectable()
export class StorageService implements OnModuleInit{
  private storageService: StorageServiceClient;

  constructor(@Inject(STORAGE_SERVICE) private storageClient: ClientGrpc) {}
  
  onModuleInit() {
    this.storageService = this.storageClient.getService<StorageServiceClient>(STORAGE_SERVICE_NAME);
    console.log("StorageService initialized")
    console.log(this.storageService)
  }

  async uploadFile(request: UploadFileRequest): Promise<UploadFileResponse> {
    return this.storageService.uploadFile(request).toPromise();
  }

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    return this.storageService.readFile(request).toPromise();
  }

  async deleteFile(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return this.storageService.readFile(request).toPromise();
  }
}