import http from "node:http"
import express from "express"
import cors from "cors"
import { env } from "./config/env.js"
import { baseLogger } from "./config/logger.js"
import { connectDB } from "./config/db.js"
import { requestId } from "./middlewares/requestId.js"
import { requestLogger } from "./middlewares/requestLogger.js"
import { security } from "./middlewares/security.js"
import { notFound, errorHandler } from "./middlewares/errorHandler.js"
import { initSocket } from "./socket/index.js"
import { ScoringEngine } from "./services/scoring.js"
import { createGameRouter } from "./controllers/gameController.js"

async function main() {
  await connectDB()

  const app = express()
  app.disable("x-powered-by")
  app.use(cors())
  app.use(express.json())
  app.use(requestId())
  app.use(requestLogger())
  app.use(security())

  // shared scoring engine instance
  const scoringEngine = new ScoringEngine(baseLogger)

  // routes
  app.use("/api", createGameRouter(scoringEngine, baseLogger))

  // errors
  app.use(notFound)
  app.use(errorHandler)

  // http + socket
  const server = http.createServer(app)
  initSocket(server, baseLogger, scoringEngine)

  server.listen(env.PORT, () => {
    baseLogger.info(`Server listening on http://localhost:${env.PORT}`)
  })
}

// Only run if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  // eslint-disable-next-line no-console
  main().catch((err) => {
    console.error("Fatal:", err)
    process.exit(1)
  })
}

export default main
