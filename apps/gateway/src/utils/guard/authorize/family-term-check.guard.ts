import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { FAMILY_SERVICE } from '../../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class FamilyTermCheckGuard {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const familyRequest$ = this.familyClient
      .send('familyClient/termCheck', { id_family })
      .pipe(timeout(15000));

    const familyCheck = await lastValueFrom(familyRequest$);
    await this.redisService.set(cacheKey, familyCheck, 'EX', 3600);
    return familyCheck;
  }
}
