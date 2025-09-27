import express from 'express';
import { HTTP_STATUS, ERROR_CODES } from '../utils/constants.js';
import { createSuccess, createError, isValidPlayerId } from '../utils/gameHelpers.js';
import { playerSchemas, validatePlayerInput, validatePawnArray } from '../validation/playerSchemas.js';

export function createPlayersRouter(playerService, logger) {
  const router = express.Router();

  // Create a new player
  router.post('/', (req, res) => {
    try {
      const { playerId, name, pawns } = req.body;

      // Validate input
      const errors = validatePlayerInput(req.body, playerSchemas.createPlayer);
      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createError(ERROR_CODES.VALIDATION_FAILED, 'Validation failed', { errors })
        );
      }

      // Validate pawns if provided
      if (pawns && pawns.length > 0) {
        const pawnErrors = validatePawnArray(pawns);
        if (pawnErrors.length > 0) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json(
            createError(ERROR_CODES.VALIDATION_FAILED, 'Pawn validation failed', { errors: pawnErrors })
          );
        }
      }

      const player = playerService.createPlayer({ playerId, name, pawns });
      
      logger.info('Player created', { 
        playerId, 
        name,
        pawnsCount: player.pawns.length,
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.CREATED).json(
        createSuccess(player, 'Player created successfully')
      );
    } catch (error) {
      logger.error('Failed to create player', { 
        playerId: req.body.playerId,
        error: error.message, 
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to create player')
      );
    }
  });

  // Update player pawn position
  router.patch('/:playerId/pawns/:pawnId/position', (req, res) => {
    try {
      const { playerId, pawnId } = req.params;
      const { position } = req.body;

      // Validate input
      const validationData = { playerId, pawnId, position };
      const errors = validatePlayerInput(validationData, playerSchemas.updatePawnPosition);
      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createError(ERROR_CODES.VALIDATION_FAILED, 'Validation failed', { errors })
        );
      }

      // In a real application, you would retrieve the player from database
      // For now, we'll create a mock player for demonstration
      const mockPlayer = {
        playerId,
        name: 'Mock Player',
        pawns: [
          { pawnId, position: 0, score: 0, atHome: true }
        ]
      };

      const updatedPawn = playerService.updatePawnPosition(mockPlayer, pawnId, position);
      
      logger.info('Pawn position updated', { 
        playerId, 
        pawnId,
        newPosition: position,
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.OK).json(
        createSuccess(updatedPawn, 'Pawn position updated successfully')
      );
    } catch (error) {
      logger.error('Failed to update pawn position', { 
        playerId: req.params.playerId,
        pawnId: req.params.pawnId,
        error: error.message, 
        requestId: req.id 
      });
      
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          createError(ERROR_CODES.PAWN_NOT_FOUND, error.message)
        );
      }
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to update pawn position')
      );
    }
  });

  // Update player pawn score
  router.patch('/:playerId/pawns/:pawnId/score', (req, res) => {
    try {
      const { playerId, pawnId } = req.params;
      const { score } = req.body;

      // Validate input
      const validationData = { playerId, pawnId, score };
      const errors = validatePlayerInput(validationData, playerSchemas.updatePawnScore);
      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createError(ERROR_CODES.VALIDATION_FAILED, 'Validation failed', { errors })
        );
      }

      // Mock player for demonstration
      const mockPlayer = {
        playerId,
        name: 'Mock Player',
        pawns: [
          { pawnId, position: 5, score: 10, atHome: false }
        ]
      };

      const updatedPawn = playerService.updatePawnScore(mockPlayer, pawnId, score);
      
      logger.info('Pawn score updated', { 
        playerId, 
        pawnId,
        newScore: score,
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.OK).json(
        createSuccess(updatedPawn, 'Pawn score updated successfully')
      );
    } catch (error) {
      logger.error('Failed to update pawn score', { 
        playerId: req.params.playerId,
        pawnId: req.params.pawnId,
        error: error.message, 
        requestId: req.id 
      });
      
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          createError(ERROR_CODES.PAWN_NOT_FOUND, error.message)
        );
      }
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to update pawn score')
      );
    }
  });

  // Get player total score
  router.get('/:playerId/score', (req, res) => {
    try {
      const { playerId } = req.params;

      if (!isValidPlayerId(playerId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createError(ERROR_CODES.INVALID_INPUT, 'Invalid player ID format')
        );
      }

      // Mock player for demonstration
      const mockPlayer = {
        playerId,
        name: 'Mock Player',
        pawns: [
          { pawnId: `${playerId}_pawn_1`, position: 5, score: 10, atHome: false },
          { pawnId: `${playerId}_pawn_2`, position: 3, score: 8, atHome: false },
          { pawnId: `${playerId}_pawn_3`, position: 0, score: 0, atHome: true },
          { pawnId: `${playerId}_pawn_4`, position: 0, score: 0, atHome: true }
        ]
      };

      const totalScore = playerService.getPlayerTotalScore(mockPlayer);
      const activePawns = playerService.getActivePawns(mockPlayer);
      const homePawns = playerService.getHomePawns(mockPlayer);
      
      const scoreData = {
        playerId,
        totalScore,
        activePawnsCount: activePawns.length,
        homePawnsCount: homePawns.length,
        pawns: mockPlayer.pawns
      };
      
      logger.info('Player score retrieved', { 
        playerId, 
        totalScore,
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.OK).json(
        createSuccess(scoreData, 'Player score retrieved successfully')
      );
    } catch (error) {
      logger.error('Failed to retrieve player score', { 
        playerId: req.params.playerId,
        error: error.message, 
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to retrieve player score')
      );
    }
  });

  // Send pawn home (reset after capture)
  router.post('/:playerId/pawns/:pawnId/home', (req, res) => {
    try {
      const { playerId, pawnId } = req.params;

      if (!isValidPlayerId(playerId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createError(ERROR_CODES.INVALID_INPUT, 'Invalid player ID format')
        );
      }

      // Mock player for demonstration
      const mockPlayer = {
        playerId,
        name: 'Mock Player',
        pawns: [
          { pawnId, position: 15, score: 20, atHome: false }
        ]
      };

      const resetPawn = playerService.sendPawnHome(mockPlayer, pawnId);
      
      logger.info('Pawn sent home', { 
        playerId, 
        pawnId,
        requestId: req.id 
      });
      
      res.status(HTTP_STATUS.OK).json(
        createSuccess(resetPawn, 'Pawn sent home successfully')
      );
    } catch (error) {
      logger.error('Failed to send pawn home', { 
        playerId: req.params.playerId,
        pawnId: req.params.pawnId,
        error: error.message, 
        requestId: req.id 
      });
      
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          createError(ERROR_CODES.PAWN_NOT_FOUND, error.message)
        );
      }
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to send pawn home')
      );
    }
  });

  return router;
}
