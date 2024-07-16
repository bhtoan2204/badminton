import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../../decorator/permission.decorator';
import { FAMILY_SERVICE } from '../../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RmqService } from '@app/common';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
    private readonly rmqService: RmqService,
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
      const cacheResults = await Promise.all(
        permissions.map(async (permission) => {
          const cacheKey = `permissionCheck:${id_family}:${permission}`;
          const cachedResult = await this.redisService.get(cacheKey);
          return { permission, cachedResult };
        }),
      );
      const missingPermissions = cacheResults
        .filter((result) => result.cachedResult === null)
        .map((result) => result.permission);

      if (missingPermissions.length > 0) {
        const result = await this.rmqService.send(
          this.familyClient,
          'familyClient/checkExtraPackage',
          { id_family, permissions: missingPermissions },
        );

        await Promise.all(
          missingPermissions.map(async (permission) => {
            const cacheKey = `permissionCheck:${id_family}:${permission}`;
            await this.redisService.set(
              cacheKey,
              result.toString(),
              'EX',
              3600,
            );
          }),
        );

        return result;
      }

      return !cacheResults.some((result) => result.cachedResult !== 'true');
    } catch (error) {
      console.log('Failed at Permission Check', error);
      return false;
    }
  }
}
