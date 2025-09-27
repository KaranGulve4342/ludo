export class PlayerService {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Create a new player object
   */
  createPlayer({ playerId, name, pawns = [] }) {
    if (!playerId || !name) {
      throw new Error('Player ID and name are required');
    }

    const player = {
      playerId: playerId.toString(),
      name: name.trim(),
      pawns: this.initializePawns(playerId, pawns)
    };

    this.logger.debug('Player created', { playerId, name, pawnsCount: pawns.length });
    return player;
  }

  /**
   * Initialize pawns for a player
   */
  initializePawns(playerId, customPawns = []) {
    // If custom pawns provided, use them
    if (customPawns.length > 0) {
      return customPawns.map(pawn => ({
        pawnId: pawn.pawnId || `${playerId}_pawn_${Math.random().toString(36).substr(2, 9)}`,
        position: pawn.position || 0,
        score: pawn.score || 0,
        atHome: pawn.atHome !== undefined ? pawn.atHome : true
      }));
    }

    // Default: create 4 pawns for standard Ludo game
    const pawns = [];
    for (let i = 1; i <= 4; i++) {
      pawns.push({
        pawnId: `${playerId}_pawn_${i}`,
        position: 0,
        score: 0,
        atHome: true
      });
    }

    return pawns;
  }

  /**
   * Update a pawn's position and status
   */
  updatePawnPosition(player, pawnId, newPosition) {
    const pawn = player.pawns.find(p => p.pawnId === pawnId);
    if (!pawn) {
      throw new Error(`Pawn with ID ${pawnId} not found for player ${player.playerId}`);
    }

    const oldPosition = pawn.position;
    pawn.position = newPosition;
    
    // Update atHome status based on position
    pawn.atHome = newPosition === 0;

    this.logger.debug('Pawn position updated', {
      playerId: player.playerId,
      pawnId,
      oldPosition,
      newPosition,
      atHome: pawn.atHome
    });

    return pawn;
  }

  /**
   * Update a pawn's score
   */
  updatePawnScore(player, pawnId, newScore) {
    const pawn = player.pawns.find(p => p.pawnId === pawnId);
    if (!pawn) {
      throw new Error(`Pawn with ID ${pawnId} not found for player ${player.playerId}`);
    }

    const oldScore = pawn.score;
    pawn.score = Math.max(0, newScore); // Ensure score doesn't go negative

    this.logger.debug('Pawn score updated', {
      playerId: player.playerId,
      pawnId,
      oldScore,
      newScore: pawn.score
    });

    return pawn;
  }

  /**
   * Get total score for a player (sum of all pawn scores)
   */
  getPlayerTotalScore(player) {
    const totalScore = player.pawns.reduce((total, pawn) => total + pawn.score, 0);
    this.logger.debug('Player total score calculated', {
      playerId: player.playerId,
      totalScore,
      pawnScores: player.pawns.map(p => ({ pawnId: p.pawnId, score: p.score }))
    });
    return totalScore;
  }

  /**
   * Get player's pawns that are currently in play (not at home)
   */
  getActivePawns(player) {
    return player.pawns.filter(pawn => !pawn.atHome);
  }

  /**
   * Get player's pawns that are at home
   */
  getHomePawns(player) {
    return player.pawns.filter(pawn => pawn.atHome);
  }

  /**
   * Reset a pawn to home (used when captured)
   */
  sendPawnHome(player, pawnId) {
    const pawn = player.pawns.find(p => p.pawnId === pawnId);
    if (!pawn) {
      throw new Error(`Pawn with ID ${pawnId} not found for player ${player.playerId}`);
    }

    const oldPosition = pawn.position;
    const oldScore = pawn.score;
    
    pawn.position = 0;
    pawn.atHome = true;
    pawn.score = 0; // Reset score when captured

    this.logger.info('Pawn sent home', {
      playerId: player.playerId,
      pawnId,
      oldPosition,
      oldScore
    });

    return pawn;
  }

  /**
   * Validate player data structure
   */
  validatePlayer(player) {
    const errors = [];

    if (!player.playerId) {
      errors.push('Player ID is required');
    }

    if (!player.name || player.name.trim().length === 0) {
      errors.push('Player name is required');
    }

    if (!Array.isArray(player.pawns)) {
      errors.push('Player pawns must be an array');
    } else {
      player.pawns.forEach((pawn, index) => {
        if (!pawn.pawnId) {
          errors.push(`Pawn ${index + 1} missing pawnId`);
        }
        if (typeof pawn.position !== 'number' || pawn.position < 0) {
          errors.push(`Pawn ${index + 1} has invalid position`);
        }
        if (typeof pawn.score !== 'number' || pawn.score < 0) {
          errors.push(`Pawn ${index + 1} has invalid score`);
        }
        if (typeof pawn.atHome !== 'boolean') {
          errors.push(`Pawn ${index + 1} has invalid atHome status`);
        }
      });
    }

    if (errors.length > 0) {
      this.logger.warn('Player validation failed', { 
        playerId: player.playerId, 
        errors 
      });
    }

    return errors;
  }

  /**
   * Create a safe player object for client (without sensitive data)
   */
  toClientSafePlayer(player) {
    return {
      playerId: player.playerId,
      name: player.name,
      pawns: player.pawns.map(pawn => ({
        pawnId: pawn.pawnId,
        position: pawn.position,
        score: pawn.score,
        atHome: pawn.atHome
      })),
      totalScore: this.getPlayerTotalScore(player)
    };
  }
}
