import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { SocketAuth } from '../src/socket/socketAuth.js';
import { createSocketHandlers } from '../src/socket/gameHandlers.js';

export function initSocket(httpServer, logger, scoringEngine) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.SOCKET_CORS_ORIGIN,
      methods: ['GET', 'POST'],
    },
    connectionStateRecovery: {},
  });

  // Initialize socket authentication
  const socketAuth = new SocketAuth(logger);
  
  // Add authentication middleware
  io.use(socketAuth.authenticate());

  // Initialize socket handlers
  const handlers = createSocketHandlers(io, logger, scoringEngine);

  io.on('connection', (socket) => {
    logger.info('socket connected', { 
      sid: socket.id, 
      playerId: socket.playerId, 
      playerName: socket.playerName 
    });

    // Handle socket events using the new handler system
    handlers.handleConnection(socket);

    socket.on('disconnect', (reason) => {
      socketAuth.unregisterSocket(socket);
      logger.info('socket disconnected', { sid: socket.id, reason });
    });
  });

  return io;
}
