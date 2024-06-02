import { HttpException, Inject, Injectable } from "@nestjs/common";
import { AUTH_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class FirebaseService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy
  ) { }

  async saveFCMToken(userId: string, fcmToken: string) {
    try {
      const source = this.authClient.send('authClient/saveFCMToken', { userId, fcmToken }).pipe(
        timeout(15000)
      );
      const data = await lastValueFrom(source);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteFCMToken(userId: string, fcmToken: string) {
    try {
      const source = this.authClient.send('authClient/deleteFCMToken', { userId, fcmToken }).pipe(
        timeout(15000)
      );
      const data = await lastValueFrom(source);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}