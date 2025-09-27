// Socket authentication and authorization middleware

export class SocketAuth {
  constructor(logger) {
    this.logger = logger;
    this.authenticatedSockets = new Map(); // socketId -> { playerId, roomId, connectedAt }
    this.playerSockets = new Map(); // playerId -> Set of socketIds
  }

  /**
   * Middleware to authenticate socket connections
   */
  authenticate() {
    return (socket, next) => {
      try {
        // For now, we'll do basic validation
        // In production, you might want JWT validation or other auth mechanisms
        const { playerId, playerName } = socket.handshake.auth;
        
        if (!playerId || !playerName) {
          this.logger.warn('Socket connection missing auth data', { 
            socketId: socket.id,
            auth: socket.handshake.auth 
          });
          return next(new Error('Authentication failed: missing credentials'));
        }

        // Validate playerId format
        if (typeof playerId !== 'string' || playerId.trim().length === 0) {
          return next(new Error('Authentication failed: invalid player ID'));
        }

        // Validate playerName format
        if (typeof playerName !== 'string' || playerName.trim().length === 0) {
          return next(new Error('Authentication failed: invalid player name'));
        }

        // Store auth info on socket
        socket.playerId = playerId.trim();
        socket.playerName = playerName.trim();
        socket.authenticatedAt = new Date();

        this.logger.info('Socket authenticated', {
          socketId: socket.id,
          playerId: socket.playerId,
          playerName: socket.playerName
        });

        next();
      } catch (error) {
        this.logger.error('Socket authentication error', {
          socketId: socket.id,
          error: error.message
        });
        next(new Error('Authentication failed'));
      }
    };
  }

  /**
   * Register an authenticated socket
   */
  registerSocket(socket, roomId) {
    const socketInfo = {
      playerId: socket.playerId,
      playerName: socket.playerName,
      roomId,
      connectedAt: socket.authenticatedAt || new Date()
    };

    this.authenticatedSockets.set(socket.id, socketInfo);

    // Track player's sockets
    if (!this.playerSockets.has(socket.playerId)) {
      this.playerSockets.set(socket.playerId, new Set());
    }
    this.playerSockets.get(socket.playerId).add(socket.id);

    this.logger.debug('Socket registered', {
      socketId: socket.id,
      playerId: socket.playerId,
      roomId
    });
  }

  /**
   * Unregister a socket on disconnect
   */
  unregisterSocket(socket) {
    const socketInfo = this.authenticatedSockets.get(socket.id);
    
    if (socketInfo) {
      this.authenticatedSockets.delete(socket.id);
      
      // Remove from player's socket set
      const playerSocketSet = this.playerSockets.get(socketInfo.playerId);
      if (playerSocketSet) {
        playerSocketSet.delete(socket.id);
        if (playerSocketSet.size === 0) {
          this.playerSockets.delete(socketInfo.playerId);
        }
      }

      this.logger.debug('Socket unregistered', {
        socketId: socket.id,
        playerId: socketInfo.playerId,
        roomId: socketInfo.roomId
      });
    }
  }

  /**
   * Check if socket is authorized for a specific room
   */
  isAuthorizedForRoom(socket, roomId) {
    const socketInfo = this.authenticatedSockets.get(socket.id);
    return socketInfo && socketInfo.roomId === roomId;
  }

  /**
   * Get all socket IDs for a player
   */
  getPlayerSockets(playerId) {
    return this.playerSockets.get(playerId) || new Set();
  }

  /**
   * Get socket info
   */
  getSocketInfo(socketId) {
    return this.authenticatedSockets.get(socketId);
  }

  /**
   * Get all authenticated sockets in a room
   */
  getRoomSockets(roomId) {
    const roomSockets = [];
    for (const [socketId, info] of this.authenticatedSockets.entries()) {
      if (info.roomId === roomId) {
        roomSockets.push({ socketId, ...info });
      }
    }
    return roomSockets;
  }

  /**
   * Check for duplicate connections (same player, multiple sockets)
   */
  hasDuplicateConnections(playerId) {
    const playerSocketSet = this.playerSockets.get(playerId);
    return playerSocketSet && playerSocketSet.size > 1;
  }

  /**
   * Disconnect all sockets for a player
   */
  disconnectPlayer(playerId, io, reason = 'duplicate connection') {
    const socketIds = this.getPlayerSockets(playerId);
    
    socketIds.forEach(socketId => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('auth:disconnect', { reason });
        socket.disconnect(true);
      }
    });

    this.logger.info('Player disconnected', {
      playerId,
      reason,
      socketCount: socketIds.size
    });
  }

  /**
   * Validate room access for socket operations
   */
  validateRoomAccess(socket, roomId) {
    if (!socket.playerId) {
      throw new Error('Socket not authenticated');
    }

    const socketInfo = this.authenticatedSockets.get(socket.id);
    if (!socketInfo) {
      throw new Error('Socket not registered');
    }

    if (socketInfo.roomId !== roomId) {
      throw new Error(`Socket not authorized for room ${roomId}`);
    }

    return true;
  }

  /**
   * Get statistics about authenticated connections
   */
  getStats() {
    const roomStats = {};
    const playerStats = {};

    for (const [_socketId, info] of this.authenticatedSockets.entries()) {
      // Room stats
      if (!roomStats[info.roomId]) {
        roomStats[info.roomId] = { players: new Set(), sockets: 0 };
      }
      roomStats[info.roomId].players.add(info.playerId);
      roomStats[info.roomId].sockets++;

      // Player stats
      if (!playerStats[info.playerId]) {
        playerStats[info.playerId] = { sockets: 0, rooms: new Set() };
      }
      playerStats[info.playerId].sockets++;
      playerStats[info.playerId].rooms.add(info.roomId);
    }

    // Convert Sets to counts
    Object.values(roomStats).forEach(stat => {
      stat.players = stat.players.size;
    });
    Object.values(playerStats).forEach(stat => {
      stat.rooms = stat.rooms.size;
    });

    return {
      totalSockets: this.authenticatedSockets.size,
      totalPlayers: this.playerSockets.size,
      roomStats,
      playerStats
    };
  }
}
