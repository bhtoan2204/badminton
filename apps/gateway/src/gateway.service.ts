import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy
  ) { }

  async getHello() {
    const source = this.authClient.send('helloauth', { message: "hello auth" });
    const data = await lastValueFrom(source);
    return data;
  }
}
