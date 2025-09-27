import { ScoringEngine } from '../../src/services/scoringService.js';

describe('ScoringEngine', () => {
  let scoringEngine;
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn()
    };
    scoringEngine = new ScoringEngine(mockLogger);
  });

  describe('updatePawnScore', () => {
    test('should update pawn score correctly', () => {
      const roomId = 'room1';
      const playerId = 'player1';
      const pawnId = 'pawn1';
      const steps = 4;

      const result = scoringEngine.updatePawnScore({
        roomId,
        playerId,
        pawnId,
        steps
      });

      expect(result.pawnScore).toBe(4);
      expect(result.playerTotal).toBe(4);
      expect(result.bonus).toBe(0);
    });

    test('should apply bonus for rolling 6', () => {
      const roomId = 'room1';
      const playerId = 'player1';
      const pawnId = 'pawn1';
      const steps = 6;

      const result = scoringEngine.updatePawnScore({
        roomId,
        playerId,
        pawnId,
        steps
      });

      expect(result.pawnScore).toBe(8); // 6 + 2 bonus
      expect(result.playerTotal).toBe(8);
      expect(result.bonus).toBe(2);
    });
  });

  describe('handleCapture', () => {
    test('should transfer victim score to striker', () => {
      const roomId = 'room1';
      
      // Setup victim with some score
      scoringEngine.updatePawnScore({
        roomId,
        playerId: 'victim',
        pawnId: 'victimPawn',
        steps: 5
      });

      // Setup striker
      scoringEngine.updatePawnScore({
        roomId,
        playerId: 'striker',
        pawnId: 'strikerPawn',
        steps: 3
      });

      const result = scoringEngine.handleCapture({
        roomId,
        striker: { playerId: 'striker', pawnId: 'strikerPawn' },
        victim: { playerId: 'victim', pawnId: 'victimPawn' }
      });

      expect(result.striker.pawnScore).toBe(8); // 3 + 5
      expect(result.victim.pawnScore).toBe(0);
      expect(result.victim.total).toBe(0);
    });
  });

  describe('getScores', () => {
    test('should return empty object for new room', () => {
      const scores = scoringEngine.getScores('newRoom');
      expect(scores).toEqual({});
    });

    test('should return correct scores for room', () => {
      scoringEngine.updatePawnScore({
        roomId: 'room1',
        playerId: 'player1',
        pawnId: 'pawn1',
        steps: 5
      });

      const scores = scoringEngine.getScores('room1');
      expect(scores).toEqual({ player1: 5 });
    });
  });
});
