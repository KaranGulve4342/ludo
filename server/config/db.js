import mongoose from 'mongoose';
import { env } from './env.js';
import { baseLogger } from './logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
    });
    baseLogger.info('Connected to MongoDB');
  } catch (err) {
    baseLogger.error('Mongo connection failed', { error: err.message });
    throw err;
  }

  mongoose.connection.on('disconnected', () => baseLogger.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => baseLogger.info('MongoDB reconnected'));
}
