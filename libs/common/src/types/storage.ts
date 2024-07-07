/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'storage';

export interface UploadFileRequest {
  fileName: string;
  file: Uint8Array;
}

export interface UploadFileResponse {
  fileName: string;
  fileUrl: string;
  message: string;
}

export interface ReadFileRequest {
  fileName: string;
  filePath: string;
}

export interface ReadFileResponse {
  fileName: string;
  fileContent: string;
  message: string;
  mimeType: string;
}

export interface DeleteFileRequest {
  fileName: string;
}

export interface DeleteFileResponse {
  fileName: string;
  message: string;
}

export const STORAGE_PACKAGE_NAME = 'storage';

export interface StorageServiceClient {
  uploadFile(request: UploadFileRequest): Observable<UploadFileResponse>;

  readFile(request: ReadFileRequest): Observable<ReadFileResponse>;

  deleteFile(request: DeleteFileRequest): Observable<DeleteFileResponse>;

  uploadImageChat(request: UploadFileRequest): Observable<UploadFileResponse>;

  uploadVideoChat(request: UploadFileRequest): Observable<UploadFileResponse>;

  uploadImageStep(request: UploadFileRequest): Observable<UploadFileResponse>;

  deleteImageStep(request: DeleteFileRequest): Observable<DeleteFileResponse>;

  uploadImageHousehold(
    request: UploadFileRequest,
  ): Observable<UploadFileResponse>;

  deleteImageHousehold(
    request: DeleteFileRequest,
  ): Observable<DeleteFileResponse>;

  uploadImageInvoice(
    request: UploadFileRequest,
  ): Observable<UploadFileResponse>;

  deleteImageInvoice(
    request: DeleteFileRequest,
  ): Observable<DeleteFileResponse>;

  uploadImageUtility(
    request: UploadFileRequest,
  ): Observable<UploadFileResponse>;

  deleteImageUtility(
    request: DeleteFileRequest,
  ): Observable<DeleteFileResponse>;

  uploadImageExpense(
    request: UploadFileRequest,
  ): Observable<UploadFileResponse>;

  deleteImageExpense(
    request: DeleteFileRequest,
  ): Observable<DeleteFileResponse>;

  uploadImageRoom(request: UploadFileRequest): Observable<UploadFileResponse>;

  deleteImageRoom(request: DeleteFileRequest): Observable<DeleteFileResponse>;

  uploadImageAsset(request: UploadFileRequest): Observable<UploadFileResponse>;

  deleteImageAsset(request: DeleteFileRequest): Observable<DeleteFileResponse>;
}

type UploadFileResult =
  | Promise<UploadFileResponse>
  | Observable<UploadFileResponse>
  | UploadFileResponse;

export interface StorageServiceController {
  uploadFile(request: UploadFileRequest): UploadFileResult;

  readFile(
    request: ReadFileRequest,
  ):
    | Promise<ReadFileResponse>
    | Observable<ReadFileResponse>
    | ReadFileResponse;

  deleteFile(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;

  uploadImageChat(request: UploadFileRequest): UploadFileResult;

  uploadVideoChat(request: UploadFileRequest): UploadFileResult;

  uploadImageStep(request: UploadFileRequest): UploadFileResult;

  deleteImageStep(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;

  uploadImageHousehold(request: UploadFileRequest): UploadFileResult;

  deleteImageHousehold(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;

  uploadImageInvoice(request: UploadFileRequest): UploadFileResult;

  deleteImageInvoice(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;

  uploadImageUtility(request: UploadFileRequest): UploadFileResult;

  deleteImageUtility(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;

  uploadImageExpense(request: UploadFileRequest): UploadFileResult;

  deleteImageExpense(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;

  uploadImageRoom(request: UploadFileRequest): UploadFileResult;

  deleteImageRoom(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;

  uploadImageAsset(request: UploadFileRequest): UploadFileResult;

  deleteImageAsset(
    request: DeleteFileRequest,
  ):
    | Promise<DeleteFileResponse>
    | Observable<DeleteFileResponse>
    | DeleteFileResponse;
}

export function StorageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'uploadFile',
      'readFile',
      'deleteFile',
      'uploadImageChat',
      'uploadVideoChat',
      'uploadImageStep',
      'deleteImageStep',
      'uploadImageHousehold',
      'deleteImageHousehold',
      'uploadImageInvoice',
      'deleteImageInvoice',
      'uploadImageUtility',
      'deleteImageUtility',
      'uploadImageExpense',
      'deleteImageExpense',
      'uploadImageRoom',
      'deleteImageRoom',
      'uploadImageAsset',
      'deleteImageAsset',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('StorageService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('StorageService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const STORAGE_SERVICE_NAME = 'StorageService';
