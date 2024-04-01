import { logger } from "@app/common";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const body = req.body ? JSON.stringify(this.sanitizeRequestBody(req.body)) : 'No Body';
    const queryParams = req.query ? JSON.stringify(req.query) : 'No Query Params';
    
    logger.info(`Incoming request: ${req.method} ${req.url} - Body: ${body} - Query: ${queryParams}`);
    
    return next
      .handle()
      .pipe(
        tap(() => logger.info(`Outgoing response: ${req.method} ${req.url}`))
      );
  }

  
  private sanitizeRequestBody(body: any): any {
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '******';
    }
    if (sanitizedBody.secret) {
      sanitizedBody.secret = '******';
    }
    return sanitizedBody;
  }
}
