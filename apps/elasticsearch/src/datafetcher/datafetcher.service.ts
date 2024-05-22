import { Injectable } from "@nestjs/common";

@Injectable()
export class DatafetcherService {
  getHello(): string {
    return "Hello World!";
  }
}