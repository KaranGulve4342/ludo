# Ludo Game Backend API

A production-ready Node.js backend for a multiplayer Ludo game with Socket.IO real-time communication and MongoDB Atlas persistence.

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
│   ├── models/            # Database schemas (Game, Player, Pawn)
│   ├── middleware/        # Express middleware
│   ├── validation/        # Input validation schemas
│   ├── socket/            # Socket.IO handlers & authentication
│   ├── utils/             # Utility functions & constants
│   └── routes/            # API routes (health, games, players)
├── config/                # Configuration (DB, env, logging)
├── socket/                # Socket.IO initialization
└── Docker files           # Production deployment
```

## 🚀 Features

- **Real-time multiplayer** using Socket.IO
- **MongoDB Atlas** production database
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
- `game:join { roomId, playerId, playerName, pawns: string[] }` - Join a game room
- `game:move { roomId, playerId, pawnId, steps }` - Make a pawn move  
- `game:capture { roomId, striker: {playerId, pawnId}, victim: {playerId, pawnId} }` - Capture opponent pawn
- `game:end { roomId }` - End game

### Emitted Events
- `game:scores { [playerId]: total }` - Score updates broadcast
- `game:move:ack` - Move acknowledgment
- `game:capture:ack` - Capture acknowledgment
- `game:ended` - Game finished

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- (Optional) Redis for scaling

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ludo?retryWrites=true&w=majority

# Server
PORT=5000
LOG_DIR=./logs

# Socket.IO & CORS
SOCKET_CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000/socket.io/

# Game Configuration  
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

### Code Quality
```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
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

## 📊 Production Features

- **MongoDB Atlas**: Production database with connection pooling
- **Winston logging**: Structured logging with rotation
- **Error handling**: Centralized error management
- **Health checks**: Kubernetes-ready endpoints
- **Request tracing**: Unique request IDs for debugging
- **Security**: Helmet middleware and input validation

## 🚀 Deployment

### Environment Setup
1. Create MongoDB Atlas cluster
2. Configure environment variables
3. Deploy using Docker or directly with Node.js

### Production Checklist
- [x] Environment variables secured
- [x] MongoDB Atlas connection configured
- [x] Logging configured
- [x] Error handling implemented
- [x] Security middleware added
- [x] Docker containers configured
- [x] Health checks implemented

## 📈 Performance Features

- O(1) score calculations using Maps
- Efficient MongoDB queries with indexes
- Connection pooling for Atlas
- Request/response compression
- Stateless design for horizontal scaling

## 📝 License

MIT License
