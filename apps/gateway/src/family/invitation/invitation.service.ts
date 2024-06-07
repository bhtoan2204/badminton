import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FAMILY_SERVICE } from "../../utils";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class InvitationService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy
  ) {}

  async getInvitationCode(id_user: string, id_family: number) {
    try {
      const response = this.familyClient
        .send('familyClient/getInvitationCode', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async generateInvitation(id_user: string, id_family: number) {
    try {
      const response = this.familyClient
        .send('familyClient/generateInvitation', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async handleInvitation(id_user: string, id_family: number, code: string) {
    try {
      const response = this.familyClient
        .send('familyClient/handleInvitation', { id_user, id_family, code })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}