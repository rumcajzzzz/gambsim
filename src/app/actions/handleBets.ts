'use server';

import { connect } from '@/lib/mongo';
import UserStats from '@/lib/models/user.model';
import GameState from '@/lib/models/gamestate.model';

export async function resolveBets(userId: string, rolledSlotColor: "red" | "black" | "green") {
	await connect();

	const user = await UserStats.findOne({ user_id: userId });
	if (!user) throw new Error('User not found');

	const gameState = await GameState.findOne().sort({ created_at: -1 });
	if (!gameState) throw new Error('Game state not found');

	const userBet = gameState.bets.find((bet: any) => bet.user_id === userId);
	if (!userBet) return { newBalance: user.current_balance, change: 0 };

	let winnings = 0;

	if (rolledSlotColor === "green") winnings = userBet.green * 14;
	if (rolledSlotColor ===  "red") winnings = userBet.red * 2;
	if (rolledSlotColor === "black") winnings = userBet.black * 2;

	user.current_balance += winnings;
	await user.save();

	gameState.bets = gameState.bets.filter((b: any) => b.user_id !== userId);
	await gameState.save();

	return {
		newBalance: user.current_balance,
		change: winnings,
	};
}
