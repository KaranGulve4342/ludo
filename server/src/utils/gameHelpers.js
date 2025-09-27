import { LUDO_CONSTANTS } from './constants.js';

/**
 * Game helper functions for Ludo game logic
 */

/**
 * Generate a unique room ID
 */
export function generateRoomId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `room_${timestamp}_${randomStr}`;
}

/**
 * Generate a unique player ID
 */
export function generatePlayerId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `player_${timestamp}_${randomStr}`;
}

/**
 * Generate pawn IDs for a player
 */
export function generatePawnIds(playerId, count = LUDO_CONSTANTS.PAWNS_PER_PLAYER) {
  const pawnIds = [];
  for (let i = 1; i <= count; i++) {
    pawnIds.push(`${playerId}_pawn_${i}`);
  }
  return pawnIds;
}

/**
 * Calculate if a move is valid based on dice roll and pawn position
 */
export function isValidMove(pawn, diceRoll, _boardState = {}) {
  // Can't move with 0 steps
  if (diceRoll < LUDO_CONSTANTS.DICE_MIN || diceRoll > LUDO_CONSTANTS.DICE_MAX) {
    return { valid: false, reason: 'Invalid dice roll' };
  }

  // Pawn at home can only move with a 6
  if (pawn.atHome && diceRoll !== LUDO_CONSTANTS.LUCKY_NUMBER) {
    return { valid: false, reason: 'Need to roll 6 to move pawn from home' };
  }

  // Calculate new position
  const newPosition = pawn.atHome ? 1 : pawn.position + diceRoll;

  // Check if move would go beyond win position
  if (newPosition > LUDO_CONSTANTS.WIN_POSITION) {
    return { valid: false, reason: 'Move would exceed board limit' };
  }

  // Check for collision with own pawns (basic check)
  // In a full implementation, you'd check against all pawns of the same player
  
  return { valid: true, newPosition };
}

/**
 * Check if a pawn can capture another pawn at a given position
 */
export function canCapture(attackerPawn, targetPawn, targetPosition) {
  // Can't capture own pawns
  if (attackerPawn.playerId === targetPawn.playerId) {
    return false;
  }

  // Can't capture pawns at home
  if (targetPawn.atHome) {
    return false;
  }

  // Can't capture pawns on safe positions
  if (LUDO_CONSTANTS.SAFE_POSITIONS.includes(targetPosition)) {
    return false;
  }

  // Must be at the same position
  return attackerPawn.position === targetPosition && targetPawn.position === targetPosition;
}

/**
 * Calculate score bonus for a move
 */
export function calculateMoveBonus(diceRoll, isCapture = false, comboCount = 0) {
  let bonus = 0;

  // Bonus for rolling 6
  if (diceRoll === LUDO_CONSTANTS.LUCKY_NUMBER) {
    bonus += LUDO_CONSTANTS.STARTING_BONUS;
  }

  // Capture bonus
  if (isCapture && comboCount >= 2) {
    bonus += LUDO_CONSTANTS.CAPTURE_COMBO_BONUS;
  }

  return bonus;
}

/**
 * Determine if a player gets another turn
 */
export function getAnotherTurn(diceRoll) {
  return diceRoll === LUDO_CONSTANTS.LUCKY_NUMBER;
}

/**
 * Get next player turn in clockwise order
 */
export function getNextPlayer(currentPlayerId, playerList) {
  const currentIndex = playerList.findIndex(p => p.playerId === currentPlayerId);
  if (currentIndex === -1) {
    return playerList[0]; // Default to first player
  }
  
  const nextIndex = (currentIndex + 1) % playerList.length;
  return playerList[nextIndex];
}

/**
 * Check if all pawns of a player have reached home (won the game)
 */
export function hasPlayerWon(player) {
  return player.pawns.every(pawn => pawn.position === LUDO_CONSTANTS.WIN_POSITION);
}

/**
 * Get player ranking based on scores
 */
export function getPlayerRanking(players) {
  return players
    .map(player => ({
      ...player,
      totalScore: player.pawns.reduce((sum, pawn) => sum + pawn.score, 0)
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((player, index) => ({
      ...player,
      rank: index + 1
    }));
}

/**
 * Check if game should end (win condition or timeout)
 */
export function shouldEndGame(players, gameStartTime, maxDuration) {
  // Check if any player has won
  const winner = players.find(player => hasPlayerWon(player));
  if (winner) {
    return { shouldEnd: true, reason: 'player_won', winner };
  }

  // Check for timeout
  if (maxDuration && Date.now() - gameStartTime > maxDuration) {
    return { shouldEnd: true, reason: 'timeout' };
  }

  return { shouldEnd: false };
}

/**
 * Validate room ID format
 */
export function isValidRoomId(roomId) {
  return typeof roomId === 'string' && 
         roomId.length >= 1 && 
         roomId.length <= 50 && 
         /^[a-zA-Z0-9_-]+$/.test(roomId);
}

/**
 * Validate player ID format
 */
export function isValidPlayerId(playerId) {
  return typeof playerId === 'string' && 
         playerId.length >= 1 && 
         playerId.length <= 50 && 
         /^[a-zA-Z0-9_-]+$/.test(playerId);
}

/**
 * Get safe positions for a specific player's color/track
 */
export function getSafePositionsForPlayer(playerIndex) {
  // In a full Ludo implementation, safe positions might be different for each player
  // This is a simplified version
  const baseSafePositions = LUDO_CONSTANTS.SAFE_POSITIONS;
  return baseSafePositions.map(pos => (pos + (playerIndex * 13)) % LUDO_CONSTANTS.BOARD_SIZE);
}

/**
 * Create a game summary for logging/analytics
 */
export function createGameSummary(game, finalScores) {
  const playerRanking = getPlayerRanking(game.players);
  
  return {
    roomId: game.roomId,
    playerCount: game.players.length,
    duration: game.updatedAt - game.createdAt,
    finalScores,
    winner: playerRanking[0],
    ranking: playerRanking,
    status: game.status
  };
}

/**
 * Format error response
 */
export function createError(code, message, details = {}) {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Format success response
 */
export function createSuccess(data, message = 'Operation successful') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Sanitize player data for client
 */
export function sanitizePlayerData(player) {
  return {
    playerId: player.playerId,
    name: player.name,
    pawns: player.pawns.map(pawn => ({
      pawnId: pawn.pawnId,
      position: pawn.position,
      score: pawn.score,
      atHome: pawn.atHome
    }))
  };
}

/**
 * Calculate game statistics
 */
export function calculateGameStats(games) {
  const stats = {
    totalGames: games.length,
    activeGames: games.filter(g => g.status === 'active').length,
    completedGames: games.filter(g => g.status === 'ended').length,
    averageDuration: 0,
    totalPlayers: 0
  };

  if (games.length > 0) {
    const completedGames = games.filter(g => g.status === 'ended');
    if (completedGames.length > 0) {
      const totalDuration = completedGames.reduce((sum, game) => {
        return sum + (new Date(game.updatedAt) - new Date(game.createdAt));
      }, 0);
      stats.averageDuration = totalDuration / completedGames.length;
    }

    stats.totalPlayers = games.reduce((sum, game) => sum + game.players.length, 0);
  }

  return stats;
}
