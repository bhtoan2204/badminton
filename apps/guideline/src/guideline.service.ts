import { Injectable } from '@nestjs/common';

@Injectable()
export class GuidelineService {
  getHello(): string {
    return 'Hello World!';
  }
}
