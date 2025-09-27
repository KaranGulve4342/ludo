# Ludo Game Backend API

A Node.js backend for a multiplayer Ludo game with Socket.IO real-time communication and MongoDB persistence.

## 🏗️ Architecture

### Modular Structure
```
server/
├── src/
│   ├── controllers/       # HTTP route handlers
│   ├── services/          # Business logic layer
│   │   ├── gameService.js      # Game management
│   │   ├── playerService.js    # Player operations
│   │   └── scoringService.js   # Scoring engine
│   ├── models/            # Database schemas
│   │   ├── Game.js
│   │   ├── Player.js
│   │   └── Pawn.js
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.js
│   │   ├── requestId.js
│   │   ├── requestLogger.js
│   │   └── security.js
│   ├── validation/        # Input validation schemas
│   │   ├── gameSchemas.js
│   │   └── playerSchemas.js
│   ├── socket/            # Socket.IO handlers
│   │   ├── gameHandlers.js
│   │   └── socketAuth.js
│   ├── utils/             # Utility functions
│   │   ├── constants.js
│   │   └── gameHelpers.js
│   └── routes/            # API routes
│       ├── health.js
│       ├── games.js
│       └── players.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── config/
│   ├── db.js
│   ├── env.js
│   └── logger.js
├── socket/
│   └── index.js
└── docs/
    └── README.md
```

## 🚀 Features

- **Real-time multiplayer** using Socket.IO
- **Modular architecture** with clear separation of concerns
- **Comprehensive validation** for all inputs
- **Advanced logging** with Winston and request tracing
- **Security middleware** with Helmet
- **Error handling** with centralized error management
- **Docker support** for containerized deployment
- **Production-ready** configuration

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health information
- `GET /api/health/ready` - Readiness probe (K8s)
- `GET /api/health/live` - Liveness probe (K8s)

### Games
- `GET /api/games` - Get all active games
- `POST /api/games` - Create a new game
- `GET /api/games/:roomId` - Get specific game
- `PATCH /api/games/:roomId/status` - Update game status
- `GET /api/games/:roomId/scores` - Get game scores
- `POST /api/games/:roomId/players` - Add player to game
- `DELETE /api/games/:roomId/players/:playerId` - Remove player
- `DELETE /api/games/:roomId` - Delete game

### Players
- `POST /api/players` - Create a new player
- `GET /api/players/:playerId/score` - Get player total score
- `PATCH /api/players/:playerId/pawns/:pawnId/position` - Update pawn position
- `PATCH /api/players/:playerId/pawns/:pawnId/score` - Update pawn score
- `POST /api/players/:playerId/pawns/:pawnId/home` - Send pawn home

## 🔌 Socket Events

### Connection Events
- `connect` - Socket connection established
- `disconnect` - Socket disconnected
- `auth:success` - Authentication successful
- `auth:failed` - Authentication failed

### Game Events
- `game:join` - Join a game room
- `game:leave` - Leave a game room
- `game:move` - Make a pawn move
- `game:capture` - Capture opponent pawn
- `game:scores` - Score updates broadcast
- `game:ended` - Game finished

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+ 
- MongoDB 6.0+
- Redis (optional, for scaling)

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
MONGO_URI=mongodb://localhost:27017/ludo
PORT=5000
LOG_DIR=./logs
SOCKET_CORS_ORIGIN=http://localhost:3000
SCORE_COMBO_WINDOW_MS=10000
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Linting & Formatting
```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

### Testing
```bash
npm test
npm run test:watch
npm run test:coverage
```

## 🐳 Docker Deployment

### Build and run with Docker Compose
```bash
docker-compose up -d
```

This will start:
- MongoDB database
- Redis cache
- Ludo backend service
- Nginx reverse proxy

### Individual Docker build
```bash
docker build -t ludo-backend .
docker run -p 5000:5000 ludo-backend
```

## 🏆 Game Logic

### Scoring System
- **Move bonus**: +2 points for rolling 6
- **Capture combo**: +5 points for capturing multiple pawns within time window
- **Position scoring**: Points based on board position progress

### Game Rules
- 2-4 players per game
- 4 pawns per player
- Roll 6 to start from home
- Capture opponents by landing on same position
- Win by getting all pawns to finish line

## 🔒 Security Features

- Helmet.js security headers
- Request ID tracking
- Input validation and sanitization
- Rate limiting (via Nginx)
- CORS configuration
- Non-root Docker user

## 📊 Monitoring & Observability

- Structured logging with Winston
- Request tracing with unique IDs
- Health check endpoints
- Performance metrics ready
- Error tracking and aggregation

## 🧪 Testing Strategy

- **Unit tests**: Individual component testing
- **Integration tests**: API endpoint testing
- **E2E tests**: Full game flow testing
- **Socket tests**: Real-time communication testing

## 🚀 Deployment Considerations

### Scaling
- Stateless design for horizontal scaling
- Redis adapter for Socket.IO clustering
- Database connection pooling
- Load balancing ready

### Production Checklist
- [x] Environment variables secured
- [x] Logging configured
- [x] Error handling implemented
- [x] Security middleware added
- [x] Docker containers configured
- [x] Health checks implemented
- [ ] SSL/TLS certificates
- [ ] Database backups
- [ ] Monitoring dashboards

## 📈 Performance Optimizations

- O(1) score calculations using Maps
- Efficient MongoDB queries with indexes
- Connection pooling
- Request/response compression
- Static asset caching (via Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details
