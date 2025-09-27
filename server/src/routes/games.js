import express from 'express';
import { HTTP_STATUS, ERROR_CODES } from '../utils/constants.js';
import { createSuccess, createError, isValidRoomId } from '../utils/gameHelpers.js';

export function createGamesRouter(gameService, scoringEngine, logger) {
  const router = express.Router();

  // Get all active games
  router.get('/', async (req, res) => {
    try {
      const games = await gameService.getActiveGames();
      logger.info('Active games retrieved', { 
        count: games.length, 
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.OK).json(
        createSuccess(games, 'Active games retrieved successfully')
      );
    } catch (error) {
      logger.error('Failed to retrieve active games', { 
        error: error.message, 
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.DATABASE_ERROR, 'Failed to retrieve games')
      );
    }
  });

  // Get specific game by room ID
  router.get('/:roomId', async (req, res) => {
    try {
      const { roomId } = req.params;

      if (!isValidRoomId(roomId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createError(ERROR_CODES.INVALID_INPUT, 'Invalid room ID format')
        );
      }

      const game = await gameService.getGame(roomId);
      if (!game) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          createError(ERROR_CODES.GAME_NOT_FOUND, 'Game not found')
        );
      }

      logger.info('Game retrieved', { roomId, requestId: req.id });
      
      res.status(HTTP_STATUS.OK).json(
        createSuccess(game, 'Game retrieved successfully')
      );
    } catch (error) {
      logger.error('Failed to retrieve game', { 
        roomId: req.params.roomId,
        error: error.message, 
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.DATABASE_ERROR, 'Failed to retrieve game')
      );
    }
  });

  // Get game scores
  router.get('/:roomId/scores', (req, res) => {
    try {
      const { roomId } = req.params;

      if (!isValidRoomId(roomId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createError(ERROR_CODES.INVALID_INPUT, 'Invalid room ID format')
        );
      }

      const scores = scoringEngine.getScores(roomId);
      
      logger.info('Game scores retrieved', { 
        roomId, 
        scores,
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.OK).json(
        createSuccess({ roomId, scores }, 'Scores retrieved successfully')
      );
    } catch (error) {
      logger.error('Failed to retrieve scores', { 
        roomId: req.params.roomId,
        error: error.message, 
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to retrieve scores')
      );
    }
  });

  return router;
}
