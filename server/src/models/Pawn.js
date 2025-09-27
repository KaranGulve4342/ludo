import mongoose from 'mongoose';

const PawnSchema = new mongoose.Schema(
  {
    pawnId: { type: String, required: true }, // unique per player
    position: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    atHome: { type: Boolean, default: true },
  },
  { _id: false },
);

export default PawnSchema;
