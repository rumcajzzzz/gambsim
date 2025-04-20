import { connect } from '@/lib/mongo';
import GameState from '@/lib/models/gamestate.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const data = await req.json();

    const updatedGameState = await GameState.findOneAndUpdate(
      {},
      {
        isRolling: data.isRolling,
        timeLeft: data.timeLeft,
        rollHistory: data.rollHistory,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json(updatedGameState);
  } catch (err) {
    console.error('Error saving game state:', err);
    return NextResponse.json({ error: 'Failed to save game state' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connect();
    const gameState = await GameState.findOne().sort({ timestamp: -1 });
    return NextResponse.json(gameState || {});
  } catch (err) {
    console.error('Error fetching game state:', err);
    return NextResponse.json({ error: 'Failed to fetch game state' }, { status: 500 });
  }
}
