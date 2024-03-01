/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "mailer";

export interface MailRequest {
  sender: string;
  recipient: string;
  subject: string;
  cc: string[];
  bcc: string[];
}

export interface MailResponse {
  success: boolean;
  message: string;
}

export const MAILER_PACKAGE_NAME = "mailer";

export interface MailerClient {
  sendMail(request: MailRequest): Observable<MailResponse>;
}

export interface MailerController {
  sendMail(request: MailRequest): Promise<MailResponse> | Observable<MailResponse> | MailResponse;
}

export function MailerControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sendMail"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Mailer", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Mailer", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MAILER_SERVICE_NAME = "Mailer";
