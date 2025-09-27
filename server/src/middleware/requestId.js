import { randomUUID } from 'node:crypto';

export function requestId() {
  return function requestIdMiddleware(req, res, next) {
    const headerId = req.headers['x-request-id'];
    const id = (typeof headerId === 'string' && headerId) || randomUUID();
    req.id = id;
    res.setHeader('x-request-id', id);
    next();
  };
}
