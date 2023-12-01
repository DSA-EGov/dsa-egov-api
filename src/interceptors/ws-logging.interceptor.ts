import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';
import { WebSocket } from 'ws';

@Injectable()
export class WsLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(WsLoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const ws = context.switchToWs();
    const data = ws.getData<WsResponse>();
    const event = ws.getPattern();

    const payload = data ? JSON.stringify(data ?? '').slice(0, 50) : null;

    this.logger.debug(`Got "${event}" ${payload}`);

    return next.handle();
  }
}
