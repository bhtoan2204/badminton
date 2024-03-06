import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { getCurrentUserByContext } from "./current-user.decorator";

export const getWsCurrentUserByContext = (context: ExecutionContext) => {
  return context.switchToWs().getData().user;
};

export const WsCurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentUserByContext(context),
);