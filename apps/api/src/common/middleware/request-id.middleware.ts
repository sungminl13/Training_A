import { randomUUID } from 'node:crypto';
import type { Response, NextFunction } from 'express';

import type { RequestWithId } from '../types/request-id';

export function requestIdMiddleware(
  req: RequestWithId,
  res: Response,
  next: NextFunction
) {
  const headerValue = req.headers['x-request-id'];
  const requestId = Array.isArray(headerValue)
    ? headerValue[0]
    : headerValue || randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
}
