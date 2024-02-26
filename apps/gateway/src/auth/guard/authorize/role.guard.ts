import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_ADMIN_KEY } from "apps/gateway/decorator/role.decorator";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiresAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiresAdmin === undefined) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requiresAdmin ? user.isadmin : true;
    }
}
