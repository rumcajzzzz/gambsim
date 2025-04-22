// import { clearBetsFromGameState } from "@/app/actions/clearBets";
// import { serverPlaceBet } from "@/app/actions/gameActions";
// import { resolveBets } from "@/app/actions/handleBets";
// import { useState } from "react";


// export const baseNumbers = Array.from({ length: 15 }, (_, i) => i);
// export const slotWidth = 80;
// export const visibleSlots = 11;
// export const centerSlot = Math.floor(visibleSlots / 2);
// export const repeatCount = 15;
// export const safeLoopZone = baseNumbers.length * 2;
// export const animationTimeLength = 8;
// export const baseColors = [
// 	"green", "red", "black", "red", "black", "red", "black", "red", "black", 
// 	"red", "black", "red", "black", "red", "black"
// ];
// export const buildSlotArray = () => {
// 	const result: number[] = [];
// 	for (let i = 0; i < repeatCount; i++) {
// 	  result.push(...baseNumbers);
// 	}
// 	return result;
// };



// export const useGameLogic = () => {
//   const [points, setPoints] = useState(0);
//   const [betAmount, setBetAmount] = useState(0);
//   const [betColor, setBetColor] = useState<string | null>(null);
//   const [rollHistory, setRollHistory] = useState<number[]>([]);

//   const [redBet, setRedBet] = useState(0);
//   const [greenBet, setGreenBet] = useState(0);
//   const [blackBet, setBlackBet] = useState(0);

//   const [showRefuel, setShowRefuel] = useState(false);

//   const timeRoundLength = 6; // Round length (seconds) !IMPORTANT
//   const betBlockTime    = 1;    // Bet block time (seconds) !IMPORTANT

//   const [timeLeft, setTimeLeft] = useState(timeRoundLength); 
//   const [canBet, setCanBet] = useState(true);
//   const [isRolling, setIsRolling] = useState(false);
//   const [logicalIndex, setLogicalIndex] = useState(0);
//   const [, setRolledSlot] = useState<number | null>(null);

//   return {
//     points, setPoints,
//     betAmount, setBetAmount,
//     betColor, setBetColor,
//     rollHistory, setRollHistory,
//     redBet, setRedBet,
//     greenBet, setGreenBet,
//     blackBet, setBlackBet,
//     showRefuel, setShowRefuel,
//     timeRoundLength, betBlockTime,
//     timeLeft, setTimeLeft,
//     canBet, setCanBet,
//     isRolling, setIsRolling,
//     logicalIndex, setLogicalIndex,
//     setRolledSlot
//   };
// };

// export const audio = (filename: string) => {
// 	const sound = new Audio(`@audio/${filename}.mp3`);
// 	sound.currentTime = 0;
// 	return sound;
// };

// export const handleBetResult = async (
// 	userId: string,
// 	rolledSlotIndex: number,
// 	setPoints: (points: number) => void,
// 	baseColors: string[],
// 	setShowRefuel: (show: boolean) => void
// ) => {
// 	try {
// 		const rolledColor = baseColors[rolledSlotIndex] as 'red' | 'black' | 'green';
// 		const result = await resolveBets(userId, rolledColor);
// 		if (result.newBalance === 0) {
// 			setShowRefuel(true);
// 		}
// 		setPoints(result.newBalance);
// 		await clearBetsFromGameState();
// 	} catch (err) {
// 		console.error('Failed to resolve bet or clear bets:', err);
// 	}
// };

// export const roll = async ({
// 	userId,
// 	setPoints,
// 	setIsRolling,
// 	setRolledSlot,
// 	setLogicalIndex,
// 	controls,
// 	baseNumbers,
// 	centerSlot,
// 	slotWidth,
// 	safeLoopZone,
// 	setRollHistory,
// 	setRedBet,
// 	setGreenBet,
// 	setBlackBet,
// 	setShowRefuel,
// 	timeRoundLength,
// 	animationTimeLength,
// 	setTimeLeft
//   }: {
// 	userId: string,
// 	setPoints: (val: number) => void,
// 	setIsRolling: (val: boolean) => void,
// 	setRolledSlot: (val: number) => void,
// 	setLogicalIndex: (val: number) => void,
// 	controls: any,
// 	baseNumbers: number[],
// 	centerSlot: number,
// 	slotWidth: number,
// 	safeLoopZone: number,
// 	setRollHistory: React.Dispatch<React.SetStateAction<number[]>>,
// 	setRedBet: (v: number) => void,
// 	setGreenBet: (v: number) => void,
// 	setBlackBet: (v: number) => void,
// 	setShowRefuel: (v: boolean) => void,
// 	timeRoundLength: number,
// 	animationTimeLength: number,
// 	setTimeLeft: (v: number) => void
//   }) => {
// 	setIsRolling(true);
// 	audio("slotroll").play();
  
// 	const loops = 6;
// 	const extraSteps = Math.floor(Math.random() * baseNumbers.length);
// 	const newIndex = loops * baseNumbers.length + extraSteps;
// 	const rolledSlotIndex = newIndex % baseNumbers.length;
  
// 	setRolledSlot(rolledSlotIndex);
  
// 	await controls.start({
// 	  x: -(newIndex - centerSlot) * slotWidth,
// 	  transition: { duration: animationTimeLength, ease: [0.05, 0.9999, 0.999999999, 1] },
// 	});
  
// 	const newSafeIndex = safeLoopZone + rolledSlotIndex;
// 	controls.set({ x: -(newSafeIndex - centerSlot) * slotWidth });
// 	setLogicalIndex(newSafeIndex);
  
// 	setRollHistory(prev => [rolledSlotIndex, ...prev].slice(0, 10));
// 	audio("slotland").play();
  
// 	try {
// 	  const result = await startRollAndResolve(userId);
// 	  setPoints(result.newBalance.newBalance);
// 	  if (result.newBalance.newBalance <= 0) setShowRefuel(true);
// 	} catch (err) {
// 	  console.error("Failed to resolve round:", err);
// 	}
  
// 	setTimeout(() => {
// 	  setIsRolling(false);
// 	  setTimeLeft(timeRoundLength);
// 	  setRedBet(0);
// 	  setGreenBet(0);
// 	  setBlackBet(0);
// 	}, 500);
//   };

// export const refuel = async (
// 	setPoints: React.Dispatch<React.SetStateAction<number>>, 
// 	setShowRefuel: React.Dispatch<React.SetStateAction<boolean>>
//   ) => {
// 	const newBalance = 1000;
// 	setPoints(newBalance);
// 	setShowRefuel(false);
  
// 	try {
// 	  const res = await fetch('/api/user-stats', {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({ setBalance: newBalance }),
// 	  });
  
// 	  if (!res.ok) {
// 		console.error('Failed to refuel on server');
// 	  } else {
// 		const updatedStats = await res.json();
// 		console.log('Balance refueled in DB:', updatedStats);
// 	  }
// 	} catch (err) {
// 	  console.error('Error refueling:', err);
// 	}
// };

// export const updateBalance = async (
//     bet: number,
//     points: number,
//     setPoints: React.Dispatch<React.SetStateAction<number>>
//     ) => {
//     if (bet > points || bet <= 0) return;
    
//     setPoints(prevPoints => prevPoints - bet);
    
//     try {
//       const res = await fetch('/api/user-stats', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ amountChange: -bet }),
//       });
    
//       if (!res.ok) {
//       console.error('Failed to update balance in DB');
//       } else {
//       const updatedStats = await res.json();
//       console.log('Balance updated in DB:', updatedStats);
//       }
//     } catch (err) {
//       console.error('Error updating balance:', err);
//     }
// };

// export async function placeBet(
// 	color: string,
// 	amount: number,
// 	currentPoints: number,
// 	setPoints: (v: number) => void,
// 	setBetColor: (v: string) => void,
// 	setRedBet: (v: number) => void,
// 	setGreenBet: (v: number) => void,
// 	setBlackBet: (v: number) => void,
// 	userID?: string
//   ) {

// 	if(!userID) return
// 	if( currentPoints <= 0) return

// 	try {
// 	  await serverPlaceBet(userID, color, amount);
  
// 	  setBetColor(color);
// 	  if (color === "red") setRedBet(amount);
// 	  else if (color === "green") setGreenBet(amount);
// 	  else if (color === "black") setBlackBet(amount);
  
// 	  setPoints(currentPoints - amount);
// 	} catch (err) {
// 	  console.error("Błąd przy obstawianiu:", err);
// 	}

// };



