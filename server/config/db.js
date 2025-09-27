import mongoose from 'mongoose';
import { env } from './env.js';
import { baseLogger } from './logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI, {
      // Production-ready options for MongoDB Atlas
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });
    baseLogger.info('Connected to MongoDB Atlas', { 
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    });
  } catch (err) {
    baseLogger.error('MongoDB Atlas connection failed', { error: err.message });
    process.exit(1); // Exit process on connection failure in production
  }

  mongoose.connection.on('disconnected', () => {
    baseLogger.warn('MongoDB Atlas disconnected');
  });
  
  mongoose.connection.on('reconnected', () => {
    baseLogger.info('MongoDB Atlas reconnected');
  });

  mongoose.connection.on('error', (err) => {
    baseLogger.error('MongoDB Atlas error', { error: err.message });
  });
}
