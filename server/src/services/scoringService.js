import { env } from '../../config/env.js';

/**
 * ScoringEngine keeps per-room, per-player scores in O(1) time.
 * - playerScores: Map<roomId, Map<playerId, number>>
 * - pawnScores: Map<roomId, Map<playerId, Map<pawnId, number>>>
 * - combo: Map<roomId, Map<playerId, { lastCaptureTs: number, streak: number }>>
 */
export class ScoringEngine {
  constructor(logger) {
    this.logger = logger;
    this.playerScores = new Map();
    this.pawnScores = new Map();
    this.combo = new Map();
  }

  ensureRoom(roomId) {
    if (!this.playerScores.has(roomId)) this.playerScores.set(roomId, new Map());
    if (!this.pawnScores.has(roomId)) this.pawnScores.set(roomId, new Map());
    if (!this.combo.has(roomId)) this.combo.set(roomId, new Map());
  }

  ensurePlayer(roomId, playerId) {
    this.ensureRoom(roomId);
    const pScores = this.playerScores.get(roomId);
    const pawns = this.pawnScores.get(roomId);
    const combo = this.combo.get(roomId);
    if (!pScores.has(playerId)) pScores.set(playerId, 0);
    if (!pawns.has(playerId)) pawns.set(playerId, new Map());
    if (!combo.has(playerId)) combo.set(playerId, { lastCaptureTs: 0, streak: 0 });
  }

  setInitialPawns(roomId, playerId, pawnIds = []) {
    this.ensurePlayer(roomId, playerId);
    const pawns = this.pawnScores.get(roomId).get(playerId);
    pawnIds.forEach((id) => {
      if (!pawns.has(id)) pawns.set(id, 0);
    });
  }

  // Bonus on rolling a 6
  getRollBonus(steps) {
    return steps === 6 ? 2 : 0;
  }

  // Combo bonus: capturing 2 pawns within the configured window
  getComboBonus(roomId, playerId) {
    const now = Date.now();
    const meta = this.combo.get(roomId).get(playerId);
    const within = now - meta.lastCaptureTs <= env.SCORE_COMBO_WINDOW_MS;
    meta.streak = within ? meta.streak + 1 : 1;
    meta.lastCaptureTs = now;
    const bonus = meta.streak >= 2 ? 5 : 0;
    return { bonus, streak: meta.streak };
  }

  // O(1) update of a pawn's score on move
  updatePawnScore({ roomId, playerId, pawnId, steps }) {
    this.ensurePlayer(roomId, playerId);
    const pMap = this.pawnScores.get(roomId).get(playerId);
    const curr = pMap.get(pawnId) ?? 0;
    const bonus = this.getRollBonus(steps);
    const next = curr + steps + bonus;
    pMap.set(pawnId, next);

    // update aggregated player score delta
    const delta = steps + bonus;
    const total = this.playerScores.get(roomId).get(playerId) + delta;
    this.playerScores.get(roomId).set(playerId, total);

    this.logger.debug('updatePawnScore', { roomId, playerId, pawnId, steps, bonus, total });
    return { pawnScore: next, playerTotal: total, bonus };
  }

  // Capture: striker pawn absorbs victim's pawn score; victim pawn resets to 0
  handleCapture({ roomId, striker, victim }) {
    // ensure entities
    this.ensurePlayer(roomId, striker.playerId);
    this.ensurePlayer(roomId, victim.playerId);

    const strikerPawns = this.pawnScores.get(roomId).get(striker.playerId);
    const victimPawns = this.pawnScores.get(roomId).get(victim.playerId);
    const strikerPawnScore = strikerPawns.get(striker.pawnId) ?? 0;
    const victimPawnScore = victimPawns.get(victim.pawnId) ?? 0;

    // combo bonus
    const combo = this.getComboBonus(roomId, striker.playerId);

    // transfer victim score to striker
    const newStrikerScore = strikerPawnScore + victimPawnScore + combo.bonus;
    strikerPawns.set(striker.pawnId, newStrikerScore);
    // reset victim
    victimPawns.set(victim.pawnId, 0);

    // update player aggregates in O(1)
    const strikerTotal = this.playerScores.get(roomId).get(striker.playerId) + victimPawnScore + combo.bonus;
    const victimTotal = this.playerScores.get(roomId).get(victim.playerId) - victimPawnScore;

    this.playerScores.get(roomId).set(striker.playerId, strikerTotal);
    this.playerScores.get(roomId).set(victim.playerId, Math.max(0, victimTotal));

    this.logger.info('handleCapture', {
      roomId,
      striker,
      victim,
      victimPawnScore,
      comboBonus: combo.bonus,
      strikerTotal,
      victimTotal: Math.max(0, victimTotal),
    });

    return {
      striker: { pawnScore: newStrikerScore, total: strikerTotal },
      victim: { pawnScore: 0, total: Math.max(0, victimTotal) },
      comboBonus: combo.bonus,
    };
  }

  // O(1) read; also offers recompute for validation
  calculatePlayerScore({ roomId, playerId, recompute = false }) {
    if (!recompute) {
      this.ensurePlayer(roomId, playerId);
      return this.playerScores.get(roomId).get(playerId);
    }
    const pawns = this.pawnScores.get(roomId).get(playerId);
    const total = Array.from(pawns.values()).reduce((a, b) => a + b, 0);
    this.playerScores.get(roomId).set(playerId, total);
    return total;
  }

  getScores(roomId) {
    this.ensureRoom(roomId);
    const map = this.playerScores.get(roomId);
    return Object.fromEntries(map.entries());
  }
}
