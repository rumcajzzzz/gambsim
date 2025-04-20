
import mongoose, { Schema } from 'mongoose';

const GameStateSchema = new Schema({
  isRolling: { type: Boolean, required: true },
  timeLeft: { type: Number, required: true },
  rollHistory: [{ type: Number }],
  timestamp: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  versionKey: false 
});

const GameState = mongoose.models.GameState || mongoose.model('GameState', GameStateSchema);

export default GameState;
