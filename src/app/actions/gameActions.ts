"use server";

import { connect } from '@lib/mongo';
import { revalidatePath } from 'next/cache';
import GameState from '@/lib/models/gamestate.model';
import UserStats from '@lib/models/user.model';

export async function serverPlaceBet(userId: string, color: string, amount: number) {
	await connect();
	const user = await UserStats.findOne({ user_id: userId });
  
	if (!user) throw new Error('User not found');
	if (user.current_balance < amount) throw new Error('Not enough balance');
  
	user.current_balance -= amount;
	user.total_betted_amount += amount;
	user.bets_placed += 1;
	
	
	let gameState = await GameState.findOne().sort({ created_at: -1 });
	if (!gameState) {
		gameState = new GameState();
	}
	const userBet = gameState.bets.find((bet: any) => bet.user_id === userId);
	
	if (userBet) {
		userBet[color] += amount; 
	} else {
		
		gameState.bets.push({
			user_id: userId,
			username: user.username,
			[color]: amount,
		});
	}

	await gameState.save();
	revalidatePath('/');

	return { success: true };
}
