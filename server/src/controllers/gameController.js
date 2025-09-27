import express from 'express';

export function createGameRouter(scoringEngine, _logger) {
  const router = express.Router();

  router.get('/health', (req, res) => {
    res.json({ ok: true, status: 'healthy', time: new Date().toISOString() });
  });

  router.get('/scores/:roomId', (req, res) => {
    const { roomId } = req.params;
    const scores = scoringEngine.getScores(roomId);
    res.json({ ok: true, roomId, scores });
  });

  return router;
}
