import mongoose from 'mongoose';
import PawnSchema from './Pawn.js';

const PlayerSchema = new mongoose.Schema(
  {
    playerId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    pawns: { type: [PawnSchema], default: [] },
  },
  { _id: false },
);

export default PlayerSchema;
