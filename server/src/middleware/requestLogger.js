import morgan from 'morgan';
import { morganStream } from '../../config/logger.js';

morgan.token('rid', (req) => req.id || '-');

const format = ':method :url :status :res[content-length] - :response-time ms rid=:rid';

export function requestLogger() {
  return morgan(format, { stream: morganStream });
}
