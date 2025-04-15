import { Dispatch, SetStateAction } from 'react';

export const updateBalance = async (
	bet: number,
	points: number,
	setPoints: React.Dispatch<React.SetStateAction<number>>
  ) => {
	if (bet > points || bet <= 0) return;
  
	setPoints(prevPoints => prevPoints - bet);
  
	try {
	  const res = await fetch('/api/user-stats', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ amountChange: -bet }),
	  });
  
	  if (!res.ok) {
		console.error('Failed to update balance in DB');
	  } else {
		const updatedStats = await res.json();
		console.log('Balance updated in DB:', updatedStats);
	  }
	} catch (err) {
	  console.error('Error updating balance:', err);
	}
  };

export const placeBet = (
  color: string,
  betAmount: number,
  points: number,
  setPoints: Dispatch<SetStateAction<number>>, 
  setBetColor: (color: string) => void,
  setRedBet: (fn: (prev: number) => number) => void,
  setGreenBet: (fn: (prev: number) => number) => void,
  setBlackBet: (fn: (prev: number) => number) => void
) => {
  if (betAmount <= 0 || betAmount > points) return;

  updateBalance(betAmount, points, setPoints);
  setBetColor(color);

  if (color === "red") setRedBet(prev => prev + betAmount);
  if (color === "green") setGreenBet(prev => prev + betAmount);
  if (color === "black") setBlackBet(prev => prev + betAmount);
};