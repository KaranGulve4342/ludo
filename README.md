# Ludo Game - Multiplayer Online Board Game

A real-time multiplayer Ludo game built with React.js and Node.js, featuring WebSocket communication, modern UI components, and comprehensive game mechanics.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Game Features](#game-features)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Game Logic](#game-logic)
- [Contributing](#contributing)

## Overview

This Ludo game application provides a complete multiplayer gaming experience with real-time communication, modern web technologies, and professional-grade code architecture. Players can create private or public game rooms, join existing games, and play the classic Ludo board game with up to 4 players in real-time.

### Key Features

- **Real-time Multiplayer**: Up to 4 players per game room
- **Room Management**: Create private/public rooms with optional passwords
- **Modern UI**: Material-UI components with Framer Motion animations
- **Responsive Design**: Works on desktop and mobile devices
- **Game State Management**: Comprehensive state synchronization
- **Error Handling**: Robust error boundaries and logging system
- **Code Quality**: ESLint, Prettier, and modern React patterns

## Tech Stack

### Frontend (Client)
- **React 18.2.0**: Modern React with Hooks and Functional Components
- **Material-UI 5.14.20**: Comprehensive UI component library
- **Framer Motion 12.23.22**: Advanced animation library
- **Socket.IO Client 4.7.2**: Real-time bidirectional communication
- **React Router 6.20.1**: Client-side routing
- **Axios 1.6.2**: HTTP client for API requests
- **React Error Boundary 6.0.0**: Error handling and recovery

### Backend (Server)
- **Node.js**: JavaScript runtime environment
- **Express 4.17.1**: Web application framework
- **Socket.IO 4.5.1**: Real-time WebSocket communication
- **MongoDB**: NoSQL database for data persistence
- **Mongoose 5.12.0**: MongoDB object modeling
- **Express Session 1.17.1**: Session management
- **CORS 2.8.5**: Cross-Origin Resource Sharing
- **dotenv 16.3.1**: Environment variable management

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **React Scripts 5.0.1**: Build and development tools
- **Mocha & Chai**: Testing framework (server-side)

## Architecture

### Client-Server Architecture

```
┌─────────────────┐    WebSocket/HTTP    ┌─────────────────┐
│                 │ ◄──────────────────► │                 │
│   React Client  │                      │  Express Server │
│                 │                      │                 │
│  • UI Components│                      │  • Game Logic   │
│  • State Mgmt   │                      │  • Room Mgmt    │
│  • Socket Events│                      │  • Player Mgmt  │
│  • Animations   │                      │  • Database     │
└─────────────────┘                      └─────────────────┘
                                                   │
                                                   ▼
                                         ┌─────────────────┐
                                         │   MongoDB       │
                                         │                 │
                                         │  • Game Rooms   │
                                         │  • Player Data  │
                                         │  • Session Data │
                                         └─────────────────┘
```

### Component Architecture

The application follows a modular component architecture with clear separation of concerns:

- **Presentation Layer**: React components with Material-UI styling
- **Business Logic Layer**: Custom hooks for game state management
- **Communication Layer**: Socket.IO for real-time updates
- **Data Layer**: MongoDB with Mongoose ODM

## Project Structure

```
ludo/
├── client/                          # Frontend React Application
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── components/             # React Components
│   │   │   ├── common/            # Reusable Components
│   │   │   │   ├── GameButton.jsx  # Enhanced button with loading states
│   │   │   │   ├── GameCard.jsx    # Consistent card container
│   │   │   │   ├── LoadingSpinner.jsx # Animated loading component
│   │   │   │   └── GameErrorBoundary.jsx # Error handling wrapper
│   │   │   ├── Gameboard/         # Game Board Components
│   │   │   │   ├── Gameboard.jsx   # Main game board container
│   │   │   │   ├── Map/            # Game map and pawn logic
│   │   │   │   │   ├── Map.jsx     # Game board visualization
│   │   │   │   │   ├── canPawnMove.js # Movement validation
│   │   │   │   │   └── getPositionAfterMove.js # Position calculation
│   │   │   │   └── positions.js    # Board position mappings
│   │   │   ├── LoginPage/         # Authentication & Room Management
│   │   │   │   ├── LoginPage.jsx   # Main login interface
│   │   │   │   ├── AddServer/      # Create new game room
│   │   │   │   ├── JoinServer/     # Join existing room
│   │   │   │   ├── NameInput/      # Player name input
│   │   │   │   └── WindowLayout/   # Consistent window styling
│   │   │   ├── Navbar/            # Game Navigation
│   │   │   │   ├── Navbar.jsx      # Main navigation bar
│   │   │   │   ├── Dice/           # Dice rolling component
│   │   │   │   ├── NameContainer/  # Player information display
│   │   │   │   └── ReadyButton/    # Game ready status
│   │   │   └── Overlay/           # Modal overlays
│   │   ├── hooks/                 # Custom React Hooks
│   │   │   ├── useGameHooks.js    # Game state management
│   │   │   ├── useEnhancedHooks.js # Advanced hook utilities
│   │   │   ├── useInput.js        # Form input handling
│   │   │   ├── useKeyPress.js     # Keyboard event handling
│   │   │   └── useSocketData.js   # Socket data management
│   │   ├── utils/                 # Utility Functions
│   │   │   ├── browserLogger.js   # Structured logging system
│   │   │   └── gameUtils.js       # Game-specific utilities
│   │   ├── theme/                 # Material-UI Theming
│   │   │   └── theme.js           # Custom theme configuration
│   │   ├── constants/             # Application Constants
│   │   │   ├── colors.js          # Game color scheme
│   │   │   ├── diceImages.js      # Dice image mappings
│   │   │   └── positions.js       # Board position constants
│   │   ├── images/               # Static Assets
│   │   └── App.js                # Root application component
│   ├── package.json              # Frontend dependencies
│   └── .eslintrc.json            # Code quality configuration
├── server/                        # Backend Node.js Application
│   ├── config/                   # Server Configuration
│   │   ├── database.js           # MongoDB connection setup
│   │   ├── session.js            # Session management configuration
│   │   └── socket.js             # Socket.IO server configuration
│   ├── handlers/                 # Socket Event Handlers
│   │   ├── gameHandler.js        # Game logic event handlers
│   │   ├── playerHandler.js      # Player management handlers
│   │   ├── roomHandler.js        # Room management handlers
│   │   └── handlersFunctions.js  # Shared handler utilities
│   ├── models/                   # Data Models
│   │   ├── player.js             # Player data model
│   │   ├── room.js               # Game room model
│   │   ├── pawn.js               # Game pawn model
│   │   └── timeoutManager.js     # Turn timeout management
│   ├── services/                 # Business Logic Services
│   │   └── roomService.js        # Room management services
│   ├── socket/                   # Socket Management
│   │   ├── socketManager.js      # Socket connection management
│   │   └── emits.js              # Socket event emissions
│   ├── utils/                    # Server Utilities
│   │   └── constants.js          # Server-side constants
│   ├── tests/                    # Test Suite
│   │   ├── handlers/             # Handler tests
│   │   ├── models/               # Model tests
│   │   └── schemas/              # Schema validation tests
│   ├── server.js                 # Main server entry point
│   └── package.json              # Backend dependencies
└── README.md                     # Project documentation
```

## Game Features

### Core Gameplay
- **Classic Ludo Rules**: Traditional board game mechanics
- **4-Player Support**: Simultaneous gameplay for up to 4 players
- **Turn-Based System**: Automatic turn management with timeouts
- **Dice Rolling**: Animated dice with random number generation
- **Pawn Movement**: Click-to-move pawn selection and validation
- **Winning Conditions**: First player to get all pawns home wins

### Room Management
- **Public Rooms**: Open rooms for anyone to join
- **Private Rooms**: Password-protected rooms
- **Room Browser**: List and filter available rooms
- **Real-time Updates**: Live room status and player count

### User Interface
- **Responsive Design**: Optimized for desktop and mobile
- **Material Design**: Modern, intuitive interface
- **Smooth Animations**: Framer Motion powered transitions
- **Error Handling**: Graceful error recovery and user feedback
- **Loading States**: Clear feedback during operations

### Technical Features
- **Real-time Synchronization**: WebSocket-based state sync
- **Session Management**: Persistent player sessions
- **Error Boundaries**: Component-level error isolation
- **Performance Logging**: Built-in performance monitoring
- **Code Quality**: ESLint and Prettier integration

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Git for version control

### Clone Repository
```bash
git clone https://github.com/KaranGulve4342/ludo.git
cd ludo
```

### Backend Setup
1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ludo
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

5. Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:4000`

### Frontend Setup
1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
REACT_APP_SERVER_URL=http://localhost:4000
REACT_APP_SOCKET_URL=http://localhost:4000
```

5. Start the development server:
```bash
npm start
```

The application will start on `http://localhost:3000`

## Development

### Available Scripts

#### Client Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier
npm run format:check # Check code formatting
```

#### Server Scripts
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm test           # Run test suite
```

### Code Quality

The project maintains high code quality through:

- **ESLint Configuration**: React-specific rules and best practices
- **Prettier Integration**: Consistent code formatting
- **Error Boundaries**: Component-level error handling
- **TypeScript-ready**: Structured for easy TypeScript migration
- **Testing Framework**: Mocha and Chai for server-side testing

### Development Guidelines

1. **Component Structure**: Follow the established component architecture
2. **Hook Usage**: Utilize custom hooks for state management
3. **Error Handling**: Always implement error boundaries
4. **Logging**: Use the structured logging system for debugging
5. **Testing**: Write tests for new features and handlers

## API Documentation

### Socket Events

#### Client to Server Events

| Event | Data | Description |
|-------|------|-------------|
| `room:create` | `{name, password?, private}` | Create a new game room |
| `room:join` | `{roomId, playerName, password?}` | Join an existing room |
| `room:leave` | - | Leave current room |
| `room:rooms` | - | Request list of available rooms |
| `game:roll` | - | Roll dice for current turn |
| `game:move` | `{pawnId, newPosition}` | Move pawn to new position |
| `player:ready` | `{ready: boolean}` | Set player ready status |
| `player:exit` | - | Exit game and return to lobby |

#### Server to Client Events

| Event | Data | Description |
|-------|------|-------------|
| `room:created` | `{room}` | Room successfully created |
| `room:joined` | `{room, player}` | Successfully joined room |
| `room:rooms` | `{rooms[]}` | List of available rooms |
| `room:data` | `{gameState}` | Current room and game data |
| `game:roll` | `{diceValue, playerId}` | Dice roll result |
| `game:move` | `{gameState}` | Updated game state after move |
| `game:winner` | `{winner}` | Game completion with winner |
| `player:joined` | `{player}` | New player joined room |
| `player:left` | `{playerId}` | Player left room |
| `error` | `{message, code?}` | Error occurred |

### HTTP Endpoints

The application primarily uses WebSocket communication, with HTTP serving the React application and handling session management.

## Game Logic

### Game Rules Implementation

#### Dice Rolling
- Players take turns rolling a six-sided die
- Rolling a 6 grants an extra turn
- Maximum of 3 consecutive 6s before turn passes

#### Pawn Movement
- Pawns start in home base and must roll 6 to enter play
- Pawns move clockwise around the board
- Landing on opponent's pawn sends it back to base
- Safe squares protect pawns from being captured

#### Winning Conditions
- First player to get all 4 pawns to the home column wins
- Pawns must reach exact home position (no overshooting)

### State Management

The game state is managed through a centralized system:

```javascript
gameState = {
  roomId: String,
  players: Array<Player>,
  pawns: Array<Pawn>,
  currentPlayer: String,
  diceValue: Number,
  gameStarted: Boolean,
  winner: String,
  turn: {
    playerId: String,
    timeRemaining: Number,
    movesMade: Number
  }
}
```

### Validation System

All game moves are validated on both client and server:

1. **Turn Validation**: Ensure it's the player's turn
2. **Dice Validation**: Verify dice has been rolled
3. **Move Validation**: Check if move is legal according to rules
4. **Position Validation**: Ensure target position is valid
5. **Game State Validation**: Verify game is in progress

## Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the coding standards
4. Run tests and linting: `npm run lint && npm test`
5. Commit your changes: `git commit -m "Add new feature"`
6. Push to the branch: `git push origin feature/new-feature`
7. Create a Pull Request

### Code Standards

- Follow ESLint configuration rules
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Bug Reports

When reporting bugs, please include:

- Browser and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Console logs or error messages

### Feature Requests

Feature requests should include:

- Clear description of the feature
- Use case and benefits
- Potential implementation approach
- Any breaking changes

---

**Note**: This project is actively maintained and open to contributions. Please refer to the issues page for current development priorities and known bugs.
