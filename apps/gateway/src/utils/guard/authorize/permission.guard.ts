import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, timeout } from 'rxjs';
import { PERMISSION_KEY } from '../../decorator/permission.decorator';
import { FAMILY_SERVICE } from '../../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      console.log('PermissionGuard');
      const request = context.switchToHttp().getRequest();
      const permissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      );
      const id_family =
        request.body.id_family ||
        request.params.id_family ||
        request.query.id_family;

      if (!id_family || !permissions || permissions.length === 0) {
        return true;
      }
      const cacheKey = `permissionCheck:${id_family}:${permissions.join(',')}`;

      const cachedResult = await this.redisService.get(cacheKey);

      if (cachedResult !== null) {
        return cachedResult === 'true';
      }

      const checkIsPermission = this.familyClient
        .send('familyClient/checkExtraPackage', { id_family, permissions })
        .pipe(timeout(15000));
      const result = await lastValueFrom(checkIsPermission);
      await this.redisService.set(cacheKey, result.toString(), 'EX', 3600);
      return result;
    } catch (error) {
      console.log('Failed at Permission Check', error);
      return false;
    }
  }
}
