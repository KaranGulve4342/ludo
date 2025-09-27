import { gameSchemas, validateInput } from '../validation/gameSchemas.js';

export function createSocketHandlers(io, logger, scoringEngine) {
  return {
    handleConnection(socket) {
      logger.info('socket connected', { sid: socket.id });

      socket.on('game:join', (data, callback) => {
        try {
          const errors = validateInput(data, gameSchemas.join);
          if (errors.length > 0) {
            const errorMsg = `Validation failed: ${errors.join(', ')}`;
            logger.warn('game:join validation failed', { errors, data });
            return callback?.({ success: false, error: errorMsg });
          }

          const { roomId, playerId, playerName, pawns = [] } = data;
          
          socket.join(roomId);
          scoringEngine.setInitialPawns(roomId, playerId, pawns);
          
          const scores = scoringEngine.getScores(roomId);
          io.to(roomId).emit('game:scores', scores);
          
          logger.info('game:join success', { roomId, playerId, playerName, pawnsCount: pawns.length });
          callback?.({ success: true, scores });
          
        } catch (err) {
          logger.error('game:join error', { error: err.message, stack: err.stack });
          callback?.({ success: false, error: 'Join failed' });
        }
      });

      socket.on('game:move', (data, callback) => {
        try {
          const errors = validateInput(data, gameSchemas.move);
          if (errors.length > 0) {
            const errorMsg = `Validation failed: ${errors.join(', ')}`;
            logger.warn('game:move validation failed', { errors, data });
            return callback?.({ success: false, error: errorMsg });
          }

          const { roomId, playerId, pawnId, steps } = data;
          const result = scoringEngine.updatePawnScore({ roomId, playerId, pawnId, steps });
          
          const scores = scoringEngine.getScores(roomId);
          io.to(roomId).emit('game:scores', scores);
          io.to(roomId).emit('game:move:ack', { 
            playerId, 
            pawnId, 
            steps, 
            bonus: result.bonus, 
            playerTotal: result.playerTotal 
          });
          
          callback?.({ success: true, result });
          
        } catch (err) {
          logger.error('game:move error', { error: err.message, stack: err.stack });
          callback?.({ success: false, error: 'Move failed' });
        }
      });

      socket.on('game:capture', (data, callback) => {
        try {
          const errors = validateInput(data, gameSchemas.capture);
          if (errors.length > 0) {
            const errorMsg = `Validation failed: ${errors.join(', ')}`;
            logger.warn('game:capture validation failed', { errors, data });
            return callback?.({ success: false, error: errorMsg });
          }

          const { roomId, striker, victim } = data;
          const result = scoringEngine.handleCapture({ roomId, striker, victim });
          
          const scores = scoringEngine.getScores(roomId);
          io.to(roomId).emit('game:scores', scores);
          io.to(roomId).emit('game:capture:ack', { striker, victim, result });
          
          callback?.({ success: true, result });
          
        } catch (err) {
          logger.error('game:capture error', { error: err.message, stack: err.stack });
          callback?.({ success: false, error: 'Capture failed' });
        }
      });

      socket.on('disconnect', (reason) => {
        logger.info('socket disconnected', { sid: socket.id, reason });
      });
    }
  };
}
