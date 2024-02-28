import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { DeleteFileRequest, DeleteFileResponse, ReadFileRequest, ReadFileResponse, StorageServiceController, StorageServiceControllerMethods, UploadFileRequest, UploadFileResponse } from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@StorageServiceControllerMethods()
export class FilesController implements StorageServiceController {
  constructor(private readonly filesService: FilesService) {}
  
  uploadFile(request: UploadFileRequest): UploadFileResponse | Observable<UploadFileResponse> | Promise<UploadFileResponse> {
    throw new Error('Method not implemented.');
  }
  readFile(request: ReadFileRequest): ReadFileResponse | Observable<ReadFileResponse> | Promise<ReadFileResponse> {
    throw new Error('Method not implemented.');
  }
  deleteFile(request: DeleteFileRequest): DeleteFileResponse | Observable<DeleteFileResponse> | Promise<DeleteFileResponse> {
    throw new Error('Method not implemented.');
  }

}
