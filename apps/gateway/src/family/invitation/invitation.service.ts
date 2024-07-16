import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FAMILY_SERVICE } from '../../utils';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RmqService } from '@app/common';

@Injectable()
export class InvitationService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
    private readonly rmqService: RmqService,
  ) {}

  async getInvitationCode(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getInvitationCode',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async generateInvitation(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getInvitationCode',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async handleInvitation(id_user: string, id_family: number, code: string) {
    try {
      const data = await this.rmqService.send(
        this.familyClient,
        'familyClient/handleInvitation',
        { id_user, id_family, code },
      );
      const cacheKey = `familyCheck:${id_family}:${id_user}`;
      await this.redisService.del(cacheKey);
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
