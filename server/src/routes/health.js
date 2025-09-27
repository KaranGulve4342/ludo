import express from 'express';
import { HTTP_STATUS } from '../utils/constants.js';
import { createSuccess, createError } from '../utils/gameHelpers.js';

export function createHealthRouter(logger) {
  const router = express.Router();

  // Basic health check
  router.get('/', (req, res) => {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    logger.info('Health check requested', { 
      requestId: req.id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(HTTP_STATUS.OK).json(createSuccess(healthData, 'Service is healthy'));
  });

  // Detailed health check
  router.get('/detailed', async (req, res) => {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
          external: process.memoryUsage().external,
          rss: process.memoryUsage().rss
        },
        cpu: process.cpuUsage(),
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version
      };

      // You could add database connectivity check here
      // const dbStatus = await checkDatabaseConnection();
      // healthData.database = dbStatus;

      res.status(HTTP_STATUS.OK).json(createSuccess(healthData, 'Detailed health check'));
    } catch (error) {
      logger.error('Detailed health check failed', { 
        error: error.message, 
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError('HEALTH_CHECK_FAILED', 'Health check failed', { error: error.message })
      );
    }
  });

  // Readiness probe (for Kubernetes)
  router.get('/ready', (req, res) => {
    // Check if service is ready to accept requests
    // This could include database connectivity, external service checks, etc.
    const readinessData = {
      ready: true,
      timestamp: new Date().toISOString()
    };

    res.status(HTTP_STATUS.OK).json(createSuccess(readinessData, 'Service is ready'));
  });

  // Liveness probe (for Kubernetes)
  router.get('/live', (req, res) => {
    // Simple liveness check
    const livenessData = {
      alive: true,
      timestamp: new Date().toISOString()
    };

    res.status(HTTP_STATUS.OK).json(createSuccess(livenessData, 'Service is alive'));
  });

  return router;
}
