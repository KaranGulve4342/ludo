import mongoose from 'mongoose';
import PlayerSchema from './Player.js';

const GameSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    players: { type: [PlayerSchema], default: [] },
    status: { type: String, enum: ['waiting', 'active', 'ended'], default: 'waiting' },
  },
  { timestamps: true },
);

export const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
