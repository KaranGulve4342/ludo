import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { baseLogger } from './config/logger.js';
import connectDB from './config/db.js';
import { requestId } from './src/middleware/requestId.js';
import { requestLogger } from './src/middleware/requestLogger.js';
import { security } from './src/middleware/security.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';
import { initSocket } from './socket/index.js';
import { ScoringEngine } from './src/services/scoringService.js';
import { GameService } from './src/services/gameService.js';
import { PlayerService } from './src/services/playerService.js';
import { createHealthRouter } from './src/routes/health.js';
import { createGamesRouter } from './src/routes/games.js';
import { createPlayersRouter } from './src/routes/players.js';

async function main() {
  await connectDB();

  const app = express();
  app.disable('x-powered-by');
  app.use(
    cors({
      origin: env.CORS_ORIGIN || env.SOCKET_CORS_ORIGIN || true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(requestId());
  app.use(requestLogger());
  app.use(security());

  // Initialize services
  const scoringEngine = new ScoringEngine(baseLogger);
  const gameService = new GameService(baseLogger);
  const playerService = new PlayerService(baseLogger);

  // routes
  app.use('/api/health', createHealthRouter(baseLogger));
  app.use('/api/games', createGamesRouter(gameService, scoringEngine, baseLogger));
  app.use('/api/players', createPlayersRouter(playerService, baseLogger));

  // errors
  app.use(notFound);
  app.use(errorHandler);

  // http + socket
  const server = http.createServer(app);
  initSocket(server, baseLogger, scoringEngine);

  server.listen(env.PORT, () => {
    baseLogger.info(`Server listening on http://localhost:${env.PORT}`);
  });
}

// Only run if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
   
  main().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  });
}

export default main;
