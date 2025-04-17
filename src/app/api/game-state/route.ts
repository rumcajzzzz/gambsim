import GameState from '@/lib/models/game.model'; 
import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongo';
import mongoose from 'mongoose';


const GameStateSchema = new mongoose.Schema({
  currentRoll: { type: Number, default: null },
  rollHistory: { type: [Number], default: [] },
  points: { type: Number, default: 1000 },
  betAmount: { type: Number, default: 0 },
  betColor: { type: String, default: null },
}, { timestamps: true });

const GLOBAL_STATE_ID = 'singleton';

export async function GET() {
  try {
    await connect();

    let state = await GameState.findById(GLOBAL_STATE_ID);

    if (!state) {
      console.log('No game state found, creating new state...');
      state = await GameState.create({
        _id: GLOBAL_STATE_ID,
        currentRoll: null,
        rollHistory: [],
        points: 1000,
        betAmount: 0,
        betColor: null,
      });
    }

    return NextResponse.json(state);
  } catch (err) {
    console.error('Error fetching game state:', err);
    return NextResponse.json({ error: 'Failed to load game state' }, { status: 500 });
  }
}

export async function POST(req: Request) {
	try {
	  const body = await req.json();
	  const { currentRoll, points, betAmount, betColor } = body;
  
	  await connect();
  
	  // Try to get the current game state
	  let state = await GameState.findById(GLOBAL_STATE_ID);
  
	  // If no state exists yet, create one with this roll
	  if (!state) {
		state = await GameState.create({
		  _id: GLOBAL_STATE_ID,
		  currentRoll,
		  rollHistory: currentRoll !== null ? [currentRoll] : [],
		  points,
		  betAmount,
		  betColor,
		});
	  } else {
		// Append the new roll to the history
		const newHistory = [...state.rollHistory, currentRoll].slice(-10);
  
		// Update the game state
		state.currentRoll = currentRoll;
		state.rollHistory = newHistory;
		state.points = points;
		state.betAmount = betAmount;
		state.betColor = betColor;
  
		await state.save(); // Save the updated state
	  }
  
	  return NextResponse.json(state);
	} catch (err) {
	  console.error("Error updating game state:", err);
	  return NextResponse.json({ error: "Failed to update game state" }, { status: 500 });
	}
  }
  