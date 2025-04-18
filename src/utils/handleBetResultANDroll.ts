import { audio } from "./audioLogic";

export const handleBetResult = async (
	rolledSlotIndex: number,
	points: number,
	setPoints: (points: number) => void,
	greenBet: number,
	redBet: number,
	blackBet: number,
	baseColors: string[],
	setShowRefuel: (show: boolean) => void
  ) => {
	let newPoints = points;
  
	if (baseColors[rolledSlotIndex] === "green" && greenBet > 0) {
	  newPoints += greenBet * 14;
	} else if (baseColors[rolledSlotIndex] === "red" && redBet > 0) {
	  newPoints += redBet * 2;
	} else if (baseColors[rolledSlotIndex] === "black" && blackBet > 0) {
	  newPoints += blackBet * 2;
	} else {
	  if (newPoints === 0) setShowRefuel(true);
	  return newPoints;
	}
  
	if (newPoints === 0) setShowRefuel(true);
	newPoints = Math.max(newPoints, 0);
	setPoints(newPoints);
  
	try {
	  if (redBet > 0 || greenBet > 0 || blackBet > 0) {
		const res = await fetch("/api/user-stats", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ amountChange: newPoints - points }),
		});
  
		if (!res.ok) {
		  console.error("Failed to update balance in DB");
		} else {
		  const updatedStats = await res.json();
		  console.log("Balance updated in DB:", updatedStats);
		}
	  } else {
		console.log("No bet was placed. Skipping DB update.");
	  }
	} catch (err) {
	  console.error("Error updating balance in DB:", err);
	}
  };

export const roll = async (
	betColor: string | null,
	points: number,
	setPoints: (pts: number) => void,
	setIsRolling: (v: boolean) => void,
	setBetAmount: (val: number) => void,
	logicalIndex: number,
	baseNumbers: number[],
	centerSlot: number,
	slotWidth: number,
	controls: any,
	setRolledSlot: (i: number) => void,
	setLogicalIndex: (i: number) => void,
	safeLoopZone: number,
	setRollHistory: (historyFn: (prev: number[]) => number[]) => void,
	setTimeLeft: (t: number) => void,
	setRedBet: (v: number) => void,
	setGreenBet: (v: number) => void,
	setBlackBet: (v: number) => void,
	greenBet: number,
	redBet: number,
	blackBet: number,
	baseColors: string[],
	setShowRefuel: (b: boolean) => void,
	timeRoundLength: number,
	betBlockTime: number,
  ) => {
	setIsRolling(true);
	setBetAmount(0);
	audio("slotroll").play();

	if (betColor !== null) {
	  setPoints(points);
	}
  
	const loops = 6;
	const extraSteps = Math.floor(Math.random() * baseNumbers.length);
	const newIndex = logicalIndex + loops * baseNumbers.length + extraSteps;
  
	const rolledSlotIndex = newIndex % baseNumbers.length;
	setRolledSlot(rolledSlotIndex);
  
	await controls.start({
	  x: -(newIndex - centerSlot) * slotWidth,
	  transition: { duration: 8, ease: [0.05, 0.9999, 0.999999999, 1] },
	});
  
	const newSafeIndex = safeLoopZone + (newIndex % baseNumbers.length);
	controls.set({ x: -(newSafeIndex - centerSlot) * slotWidth });
	setLogicalIndex(newSafeIndex);
  

  
	setRollHistory((prev) => {
	  const newHistory = [rolledSlotIndex, ...prev];
	  return newHistory.slice(0, 10);
	});
  
	setTimeout(() => {
	  setTimeLeft(timeRoundLength);
	  setIsRolling(false);
	  setRedBet(0);
	  setGreenBet(0);
	  setBlackBet(0);
	}, 500);
  	audio("slotland").play();
	handleBetResult(
	  rolledSlotIndex,
	  points,
	  setPoints,
	  greenBet,
	  redBet,
	  blackBet,
	  baseColors,
	  setShowRefuel
	);
};