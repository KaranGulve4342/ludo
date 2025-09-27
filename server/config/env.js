import process from 'node:process';

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/ludo',
  LOG_DIR: process.env.LOG_DIR || 'logs',
  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || '*',
  SCORE_COMBO_WINDOW_MS: Number(process.env.SCORE_COMBO_WINDOW_MS || 10_000),
};

export const isProd = env.NODE_ENV === 'production';
