// Application constants

export const GAME_STATUS = {
  WAITING: 'waiting',
  ACTIVE: 'active',
  ENDED: 'ended',
  PAUSED: 'paused'
};

export const SOCKET_EVENTS = {
  // Game events
  GAME_JOIN: 'game:join',
  GAME_LEAVE: 'game:leave',
  GAME_START: 'game:start',
  GAME_END: 'game:end',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  
  // Move events
  GAME_MOVE: 'game:move',
  GAME_MOVE_ACK: 'game:move:ack',
  
  // Capture events
  GAME_CAPTURE: 'game:capture',
  GAME_CAPTURE_ACK: 'game:capture:ack',
  
  // Score events
  GAME_SCORES: 'game:scores',
  GAME_SCORE_UPDATE: 'game:score:update',
  
  // Player events
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',
  PLAYER_READY: 'player:ready',
  PLAYER_NOT_READY: 'player:not_ready',
  
  // Auth events
  AUTH_SUCCESS: 'auth:success',
  AUTH_FAILED: 'auth:failed',
  AUTH_DISCONNECT: 'auth:disconnect',
  
  // Error events
  ERROR: 'error',
  VALIDATION_ERROR: 'validation:error',
  
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const LUDO_CONSTANTS = {
  MAX_PLAYERS: 4,
  PAWNS_PER_PLAYER: 4,
  BOARD_SIZE: 52,
  HOME_POSITION: 0,
  WIN_POSITION: 57, // Home stretch end
  DICE_MIN: 1,
  DICE_MAX: 6,
  LUCKY_NUMBER: 6, // Number that gives bonus and extra turn
  STARTING_BONUS: 2, // Bonus for rolling 6
  CAPTURE_COMBO_BONUS: 5, // Bonus for capturing multiple pawns quickly
  SAFE_POSITIONS: [9, 14, 22, 27, 35, 40, 48, 1], // Safe squares where pawns can't be captured
};

export const ERROR_CODES = {
  // Game errors
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  GAME_FULL: 'GAME_FULL',
  GAME_ALREADY_STARTED: 'GAME_ALREADY_STARTED',
  GAME_NOT_ACTIVE: 'GAME_NOT_ACTIVE',
  
  // Player errors
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  PLAYER_ALREADY_EXISTS: 'PLAYER_ALREADY_EXISTS',
  PLAYER_NOT_IN_GAME: 'PLAYER_NOT_IN_GAME',
  
  // Move errors
  INVALID_MOVE: 'INVALID_MOVE',
  PAWN_NOT_FOUND: 'PAWN_NOT_FOUND',
  PAWN_CANNOT_MOVE: 'PAWN_CANNOT_MOVE',
  
  // Auth errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED_ACTION: 'UNAUTHORIZED_ACTION',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // System errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
};

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug'
};

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Default configuration values
export const DEFAULT_CONFIG = {
  PORT: 5000,
  MONGO_URI: 'mongodb://localhost:27017/ludo',
  LOG_DIR: './logs',
  SOCKET_CORS_ORIGIN: '*',
  SCORE_COMBO_WINDOW_MS: 10000,
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_MS: 1000,
  GAME_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  PLAYER_DISCONNECT_TIMEOUT_MS: 2 * 60 * 1000, // 2 minutes
};

// Regular expressions for validation
export const REGEX_PATTERNS = {
  ROOM_ID: /^[a-zA-Z0-9_-]{1,50}$/,
  PLAYER_ID: /^[a-zA-Z0-9_-]{1,50}$/,
  PLAYER_NAME: /^[a-zA-Z0-9\s_-]{1,100}$/,
  PAWN_ID: /^[a-zA-Z0-9_-]{1,50}$/
};

// Rate limiting constants
export const RATE_LIMITS = {
  MOVES_PER_MINUTE: 60,
  JOINS_PER_MINUTE: 10,
  MESSAGES_PER_MINUTE: 30
};

export const CACHE_KEYS = {
  GAME_PREFIX: 'game:',
  PLAYER_PREFIX: 'player:',
  SCORES_PREFIX: 'scores:',
  ROOM_PREFIX: 'room:'
};

// Time constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
};
