import { withRequestIdLogger } from '../../config/logger.js';

export function notFound(req, res, next) {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const requestId = req.id;
  const logger = withRequestIdLogger(requestId);
  logger.error(err.message, { status, stack: err.stack });

  res.status(status).json({
    ok: false,
    error: err.message,
    requestId,
  });
}
