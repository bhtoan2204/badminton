import { Injectable } from '@nestjs/common';

@Injectable()
export class GrpcShoppingService {
  getHello(): string {
    return 'Hello World!';
  }
}
