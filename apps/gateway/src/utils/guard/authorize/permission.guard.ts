import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSION_KEY } from '../../decorator/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const perrmissions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    const id_family =
      request.body.id_family ||
      request.params.id_family ||
      request.query.id_family;
    console.log(perrmissions);
    console.log(id_family);
    return true;
  }
}
