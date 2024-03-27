import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { DeleteFileRequest, DeleteFileResponse, ReadFileRequest, ReadFileResponse, StorageServiceController, StorageServiceControllerMethods, UploadFileRequest, UploadFileResponse } from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@StorageServiceControllerMethods()
export class FilesController implements StorageServiceController {
  constructor(private readonly filesService: FilesService) {}
  
  async uploadFile(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFileToAvatar(request);
  }

  async uploadImageChat(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFileToChat(request);
  }

  async readFile(request: ReadFileRequest): Promise<ReadFileResponse> {
    return await this.filesService.readFile(request);
  }

  async deleteFile(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return await this.filesService.deleteFile(request);
  }
}
