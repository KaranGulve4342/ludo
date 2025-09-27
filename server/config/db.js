import mongoose from 'mongoose';
import { logger } from './logger.js';
import { env } from './env.js';

const connectDB = async () => {
  try {
    // Updated connection options for MongoDB Atlas
    const options = {
      // Connection management
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take
      
      // Retry logic
      retryWrites: true,
      w: 'majority',
      
      // Authentication & SSL (Atlas handles this automatically)
      authSource: 'admin',
    };

    const conn = await mongoose.connect(env.MONGO_URI, options);

    logger.info('MongoDB Atlas connected successfully', {
      service: 'ludo-server',
      host: conn.connection.host,
      database: conn.connection.name,
      port: conn.connection.port
    });

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB Atlas connection error', {
        service: 'ludo-server',
        error: error.message
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB Atlas disconnected', {
        service: 'ludo-server'
      });
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB Atlas connection closed through app termination', {
        service: 'ludo-server'
      });
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB Atlas connection failed', {
      service: 'ludo-server',
      error: error.message
    });
    
    // Exit process with failure in production
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
