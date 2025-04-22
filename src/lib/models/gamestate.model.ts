import mongoose, { Schema } from 'mongoose';

const UserBetSchema = new Schema({
  user_id: { type: String, required: true },
  username: { type: String },
  red: { type: Number, default: 0 },
  green: { type: Number, default: 0 },
  black: { type: Number, default: 0 },
});

const RollSchema = new Schema({
  rolledSlotIndex: { type: Number, required: true },
  rolledColor: { type: String, enum: ['red', 'green', 'black'], required: true },
  timestamp: { type: Date, default: Date.now },
});

const GameStateSchema = new Schema({
  round: { type: Number, default: 1 },
  bets: [UserBetSchema],
  rollHistory: [RollSchema], 
  created_at: { type: Date, default: Date.now },
});

const GameState = mongoose.models.GameState || mongoose.model('GameState', GameStateSchema);
export default GameState;
