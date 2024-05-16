import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { DeleteFileRequest, DeleteFileResponse, ReadFileRequest, ReadFileResponse, StorageServiceController, StorageServiceControllerMethods, UploadFileRequest, UploadFileResponse } from '@app/common';

@Controller()
@StorageServiceControllerMethods()
export class FilesController implements StorageServiceController {
  constructor(private readonly filesService: FilesService) { }

  async uploadFile(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFile(request, 'avatar');
  }

  async uploadImageChat(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFile(request, 'chat');
  }

  async uploadImageStep(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFile(request, 'step');
  }

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    return await this.filesService.readFile(request);
  }

  async deleteFile(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return await this.filesService.deleteFile(request, 'avatar');
  }

  async deleteImageStep(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return await this.filesService.deleteFile(request, 'step');
  }

  async uploadImageHousehold(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFile(request, 'household');
  }

  async deleteImageHousehold(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return await this.filesService.deleteFile(request, 'household');
  }

  async uploadImageInvoice(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFile(request, 'invoice');
  }

  async deleteImageInvoice(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return await this.filesService.deleteFile(request, 'invoice');
  }
}
