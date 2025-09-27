/* eslint-disable no-undef */
// MongoDB initialization script for Ludo game database

// Create the ludo database
db = db.getSiblingDB('ludo');

// Create a user for the ludo database
db.createUser({
  user: 'ludouser',
  pwd: 'ludopassword',
  roles: [
    {
      role: 'readWrite',
      db: 'ludo'
    }
  ]
});

// Create collections with initial indexes
db.createCollection('games');
db.games.createIndex({ roomId: 1 }, { unique: true });
db.games.createIndex({ status: 1 });
db.games.createIndex({ createdAt: 1 });
db.games.createIndex({ updatedAt: 1 });

// Create a sample game document structure (for reference)
db.games.insertOne({
  roomId: 'sample-room-123',
  players: [
    {
      playerId: 'player-1',
      name: 'Alice',
      pawns: [
        { pawnId: 'player-1_pawn_1', position: 0, score: 0, atHome: true },
        { pawnId: 'player-1_pawn_2', position: 0, score: 0, atHome: true },
        { pawnId: 'player-1_pawn_3', position: 0, score: 0, atHome: true },
        { pawnId: 'player-1_pawn_4', position: 0, score: 0, atHome: true }
      ]
    }
  ],
  status: 'waiting',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Ludo database initialized successfully');
print('Created user: ludouser');
print('Created indexes for games collection');
print('Inserted sample game document');
