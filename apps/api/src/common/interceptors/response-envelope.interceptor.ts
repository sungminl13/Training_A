import { Injectable, type NestInterceptor } from '@nestjs/common';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { RequestWithId } from '../types/request-id';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const requestId = request.requestId ?? '';

    return next.handle().pipe(
      map((data) => ({
        data,
        requestId,
      }))
    );
  }
}
