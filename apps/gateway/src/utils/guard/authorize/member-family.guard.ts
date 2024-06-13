import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FAMILY_SERVICE } from '../../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class MemberFamilyGuard implements CanActivate {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id_family =
      request.body.id_family ||
      request.params.id_family ||
      request.query.id_family;
    if (!id_family) {
      return true;
    }
    const id_user = request.user.id_user;
    const cacheKey = `familyCheck:${id_family}:${id_user}`;
    const cachedResult = await this.redisService.get(cacheKey);
    if (cachedResult) {
      return cachedResult === 'true';
    }
    const familyRequest$ = this.familyClient
      .send('familyClient/checkIsMember', { id_family, id_user })
      .pipe(timeout(15000));

    const familyCheck = await lastValueFrom(familyRequest$);
    await this.redisService.set(cacheKey, familyCheck.toString(), 'EX', 3600);
    return familyCheck;
  }
}
