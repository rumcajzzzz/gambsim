import mongoose, { Schema } from 'mongoose';

const UserStatsSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, default: null },
  email: { type: String, default: null },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  profile_image_url: { type: String, default: null },
  bets_placed: { type: Number, default: 0 },
  bets_won: { type: Number, default: 0 },
  bets_lost: { type: Number, default: 0 },
  total_betted_amount: { type: Number, default: 0 },
  total_won: { type: Number, default: 0 },
  total_lost: { type: Number, default: 0 },
  greens_won: { type: Number, default: 0 },
  current_balance: { type: Number, default: 0 },
  lastRefuel1h: { type: Date },
  lastRefuel4h: { type: Date },
  lastRefuel24h: { type: Date },
},{ timestamps: { createdAt: 'timeCreated', updatedAt: 'timeUpdated' } });

const UserStats = mongoose.models.UserStats || mongoose.model('UserStats', UserStatsSchema);

export default UserStats;

