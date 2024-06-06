import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdFamily = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.body.id_family ||
      request.params.id_family ||
      request.query.id_family
    );
  },
);
