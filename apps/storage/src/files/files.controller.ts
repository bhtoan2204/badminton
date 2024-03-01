import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { DeleteFileRequest, DeleteFileResponse, ReadFileRequest, ReadFileResponse, StorageServiceController, StorageServiceControllerMethods, UploadFileRequest, UploadFileResponse } from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@StorageServiceControllerMethods()
export class FilesController implements StorageServiceController {
  constructor(private readonly filesService: FilesService) {}
  
  async uploadFile(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await this.filesService.uploadFile(request);
  }
  readFile(request: ReadFileRequest): ReadFileResponse | Observable<ReadFileResponse> | Promise<ReadFileResponse> {
    throw new Error('Method not implemented.');
  }
  async deleteFile(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    return await this.filesService.deleteFile(request);
  }
}
