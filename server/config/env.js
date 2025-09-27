import process from 'node:process';
import { config } from 'dotenv';

config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3000),
  MONGO_URI: process.env.MONGO_URI,
  LOG_DIR: process.env.LOG_DIR || 'logs',
  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || '*',
  SCORE_COMBO_WINDOW_MS: Number(process.env.SCORE_COMBO_WINDOW_MS || 10_000),
};

export const isProd = env.NODE_ENV === 'production';
