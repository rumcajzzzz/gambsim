import mongoose from 'mongoose';

delete mongoose.models.GameState;

const GameStateSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  currentRoll: Number,
  rollHistory: [Number],
  points: { type: Number, default: 0 },
  betAmount: { type: Number, default: 0 },
  betColor: { type: String, default: null },
}, { timestamps: true });

const GameState = mongoose.model('GameState', GameStateSchema);

export default GameState;
