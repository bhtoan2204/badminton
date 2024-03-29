/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "storage";

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

export const STORAGE_PACKAGE_NAME = "storage";

export interface StorageServiceClient {
  uploadFile(request: UploadFileRequest): Observable<UploadFileResponse>;

  readFile(request: ReadFileRequest): Observable<ReadFileResponse>;

  deleteFile(request: DeleteFileRequest): Observable<DeleteFileResponse>;

  uploadImageChat(request: UploadFileRequest): Observable<UploadFileResponse>;

  uploadImageStep(request: UploadFileRequest): Observable<UploadFileResponse>;

  deleteImageStep(request: DeleteFileRequest): Observable<DeleteFileResponse>;
}

export interface StorageServiceController {
  uploadFile(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> | Observable<UploadFileResponse> | UploadFileResponse;

  readFile(request: ReadFileRequest): Promise<ReadFileResponse> | Observable<ReadFileResponse> | ReadFileResponse;

  deleteFile(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> | Observable<DeleteFileResponse> | DeleteFileResponse;

  uploadImageChat(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> | Observable<UploadFileResponse> | UploadFileResponse;

  uploadImageStep(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> | Observable<UploadFileResponse> | UploadFileResponse;

  deleteImageStep(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> | Observable<DeleteFileResponse> | DeleteFileResponse;
}

export function StorageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["uploadFile", "readFile", "deleteFile", "uploadImageChat", "uploadImageStep", "deleteImageStep"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StorageService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StorageService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STORAGE_SERVICE_NAME = "StorageService";
