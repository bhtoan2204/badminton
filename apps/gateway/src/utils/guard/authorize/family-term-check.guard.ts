import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { FAMILY_SERVICE } from '../../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { RmqService } from '@app/common';

@Injectable()
export class FamilyTermCheckGuard {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
    private readonly rmqService: RmqService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('FamilyTermCheckGuard');
      const request = context.switchToHttp().getRequest();
      const id_family =
        request.body.id_family ||
        request.params.id_family ||
        request.query.id_family;
      if (!id_family) {
        return true;
      }

      const cacheKey = `familyTermCheck:${id_family}`;
      const cachedFamilyCheck = await this.redisService.get(cacheKey);

      if (cachedFamilyCheck !== null) {
        return cachedFamilyCheck === 'true';
      }

      const familyCheck = await this.rmqService.send(
        this.familyClient,
        'familyClient/termCheck',
        { id_family },
      );
      await this.redisService.set(cacheKey, familyCheck, 'EX', 3600);
      return familyCheck;
    } catch (e) {
      return false;
    }
  }
}
