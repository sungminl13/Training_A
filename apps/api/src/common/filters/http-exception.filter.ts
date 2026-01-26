import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { type Response } from 'express';
import { getMessage } from '@repo/messages';

import { getApiI18n } from '../../i18n';
import type { RequestWithId } from '../types/request-id';

type ExceptionResponse = {
  code?: string;
  message?: string | string[];
  details?: unknown;
};

@Catch()
export class HttpExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException
      ? (exception.getResponse() as ExceptionResponse | string)
      : undefined;
    const code =
      typeof exceptionResponse === 'string'
        ? undefined
        : exceptionResponse?.code;
    const details =
      typeof exceptionResponse === 'string'
        ? undefined
        : exceptionResponse?.details;

    const fallbackMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : Array.isArray(exceptionResponse?.message)
          ? exceptionResponse?.message.join(', ')
          : exceptionResponse?.message ??
            (exception instanceof Error ? exception.message : 'Unexpected error');

    const acceptLanguageHeader = request.headers['accept-language'];
    const acceptLanguage = Array.isArray(acceptLanguageHeader)
      ? acceptLanguageHeader.join(',')
      : acceptLanguageHeader;
    const { messages, uiLang } = await getApiI18n(acceptLanguage);
    const resolvedCode = code ?? 'UNKNOWN_ERROR';
    const localizedMessage = getMessage(
      messages,
      resolvedCode,
      uiLang,
      fallbackMessage
    );

    const payload = {
      code: resolvedCode,
      message: localizedMessage,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      lang: uiLang,
      requestId: request.requestId ?? null,
      ...(details ? { details } : {}),
    };

    response.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).json(payload);
  }
}
