'use server';

import { connect } from '@lib/mongo';
import GameState from '@lib/models/gamestate.model';

export async function clearBetsFromGameState() {
  await connect();
  const gameState = await GameState.findOne().sort({ created_at: -1 });

  if (!gameState) return;

  gameState.bets = [];
  await gameState.save();
}
