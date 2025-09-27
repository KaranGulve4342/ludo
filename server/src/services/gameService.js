import { Game } from '../models/Game.js';

export class GameService {
  constructor(logger) {
    this.logger = logger;
  }

  async createGame(roomId, players = []) {
    try {
      const existingGame = await Game.findOne({ roomId });
      if (existingGame) {
        this.logger.warn('Game already exists', { roomId });
        return existingGame;
      }

      const game = new Game({
        roomId,
        players,
        status: 'waiting'
      });

      await game.save();
      this.logger.info('Game created', { roomId, playersCount: players.length });
      return game;
    } catch (error) {
      this.logger.error('Failed to create game', { roomId, error: error.message });
      throw error;
    }
  }

  async getGame(roomId) {
    try {
      const game = await Game.findOne({ roomId });
      if (!game) {
        this.logger.warn('Game not found', { roomId });
        return null;
      }
      return game;
    } catch (error) {
      this.logger.error('Failed to get game', { roomId, error: error.message });
      throw error;
    }
  }

  async addPlayerToGame(roomId, player) {
    try {
      const game = await Game.findOne({ roomId });
      if (!game) {
        throw new Error(`Game with roomId ${roomId} not found`);
      }

      // Check if player already exists
      const existingPlayer = game.players.find(p => p.playerId === player.playerId);
      if (existingPlayer) {
        this.logger.warn('Player already in game', { roomId, playerId: player.playerId });
        return game;
      }

      // Check game capacity (max 4 players for Ludo)
      if (game.players.length >= 4) {
        throw new Error('Game is full');
      }

      game.players.push(player);
      await game.save();
      
      this.logger.info('Player added to game', { roomId, playerId: player.playerId });
      return game;
    } catch (error) {
      this.logger.error('Failed to add player to game', { 
        roomId, 
        playerId: player.playerId, 
        error: error.message 
      });
      throw error;
    }
  }

  async updateGameStatus(roomId, status) {
    try {
      const game = await Game.findOneAndUpdate(
        { roomId },
        { status },
        { new: true }
      );

      if (!game) {
        throw new Error(`Game with roomId ${roomId} not found`);
      }

      this.logger.info('Game status updated', { roomId, status });
      return game;
    } catch (error) {
      this.logger.error('Failed to update game status', { roomId, status, error: error.message });
      throw error;
    }
  }

  async removePlayerFromGame(roomId, playerId) {
    try {
      const game = await Game.findOne({ roomId });
      if (!game) {
        throw new Error(`Game with roomId ${roomId} not found`);
      }

      game.players = game.players.filter(p => p.playerId !== playerId);
      await game.save();

      this.logger.info('Player removed from game', { roomId, playerId });
      return game;
    } catch (error) {
      this.logger.error('Failed to remove player from game', { 
        roomId, 
        playerId, 
        error: error.message 
      });
      throw error;
    }
  }

  async deleteGame(roomId) {
    try {
      const result = await Game.deleteOne({ roomId });
      if (result.deletedCount === 0) {
        this.logger.warn('Game not found for deletion', { roomId });
        return false;
      }

      this.logger.info('Game deleted', { roomId });
      return true;
    } catch (error) {
      this.logger.error('Failed to delete game', { roomId, error: error.message });
      throw error;
    }
  }

  async getActiveGames() {
    try {
      const games = await Game.find({ status: { $in: ['waiting', 'active'] } });
      return games;
    } catch (error) {
      this.logger.error('Failed to get active games', { error: error.message });
      throw error;
    }
  }
}
