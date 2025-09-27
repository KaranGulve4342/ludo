import fs from 'node:fs';
import path from 'node:path';
import winston from 'winston';
import 'winston-daily-rotate-file';
import { env, isProd } from './env.js';

const { combine, timestamp, errors, printf, colorize, json, splat } = winston.format;

// Ensure log directory exists
if (!fs.existsSync(env.LOG_DIR)) {
  fs.mkdirSync(env.LOG_DIR, { recursive: true });
}

const humanReadable = printf(({ level, message, timestamp, stack, requestId, ...meta }) => {
  const rid = requestId ? ` [rid:${requestId}]` : '';
  const base = `${timestamp} ${level}${rid}: ${message}`;
  if (stack) return `${base}\n${stack}`;
  const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${base}${rest}`;
});

export const baseLogger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: combine(timestamp(), errors({ stack: true }), splat(), isProd ? json() : combine(colorize(), humanReadable)),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(env.LOG_DIR, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'info',
      zippedArchive: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(env.LOG_DIR, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      level: 'error',
      zippedArchive: true,
    }),
  ],
  defaultMeta: { service: 'ludo-server' },
});

// Create a child logger with requestId for request-scoped logs
export function withRequestIdLogger(requestId) {
  return baseLogger.child({ requestId });
}

// Morgan stream that writes to winston
export const morganStream = {
  write: (message) => {
    // message includes trailing newline
    baseLogger.http?.(message.trim()) || baseLogger.info(message.trim());
  },
};
