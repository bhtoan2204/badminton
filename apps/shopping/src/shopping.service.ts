import { Injectable } from '@nestjs/common';

@Injectable()
export class ShoppingService {
  getHello(): string {
    return 'Hello World!';
  }
}
