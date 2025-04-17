import { useRef, useState, useEffect } from "react";



export const useGameLogic = () => {
  const [points, setPoints] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [betColor, setBetColor] = useState<string | null>(null);
  const [rollHistory, setRollHistory] = useState<number[]>([]);

  const [redBet, setRedBet] = useState(0);
  const [greenBet, setGreenBet] = useState(0);
  const [blackBet, setBlackBet] = useState(0);

  const [showRefuel, setShowRefuel] = useState(false);

  const timeRoundLength = 6; // Round length (seconds) !IMPORTANT
  const betBlockTime = 1; // Bet block time (seconds) !IMPORTANT

  const [timeLeft, setTimeLeft] = useState(timeRoundLength); 
  const [canBet, setCanBet] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [logicalIndex, setLogicalIndex] = useState(0);
  const [, setRolledSlot] = useState<number | null>(null);

  return {
    points, setPoints,
    betAmount, setBetAmount,
    betColor, setBetColor,
    rollHistory, setRollHistory,
    redBet, setRedBet,
    greenBet, setGreenBet,
    blackBet, setBlackBet,
    showRefuel, setShowRefuel,
    timeRoundLength, betBlockTime,
    timeLeft, setTimeLeft,
    canBet, setCanBet,
    isRolling, setIsRolling,
    logicalIndex, setLogicalIndex,
    setRolledSlot
  };
};

export const useSlotAudio = () => {
  const slotRollAudioRef = useRef<HTMLAudioElement | null>(null);
  const slotLandAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const playSound = (type: "roll" | "land") => {
    if (!audioUnlocked) return;
    const audioRef = type === "roll" ? slotRollAudioRef.current : slotLandAudioRef.current;
    if (audioRef) {
      audioRef.currentTime = 0;
      audioRef.play().catch(() => {});
    }
  };

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioUnlocked) {
        slotRollAudioRef.current = new Audio("./assets/mp3/slotroll.mp3");
        slotLandAudioRef.current = new Audio("./assets/mp3/slotland.mp3");
        slotRollAudioRef.current.muted = true;

        slotRollAudioRef.current.play().then(() => {
          setTimeout(() => {
            if (slotRollAudioRef.current) slotRollAudioRef.current.muted = false;
            setAudioUnlocked(true);
          }, 2000);
        }).catch(() => {
          setAudioUnlocked(true);
        });

        window.removeEventListener("click", unlockAudio);
      }
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, [audioUnlocked]);

  return { playSound };
};

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
	playSound: (type: "roll" | "land") => void
  ) => {
	setIsRolling(true);
	setBetAmount(0);
  
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
  
	playSound("land");
  
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

export const refuel = async (
	setPoints: React.Dispatch<React.SetStateAction<number>>, 
	setShowRefuel: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
	const newBalance = 1000;
	setPoints(newBalance);
	setShowRefuel(false);
  
	try {
	  const res = await fetch('/api/user-stats', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ setBalance: newBalance }),
	  });
  
	  if (!res.ok) {
		console.error('Failed to refuel on server');
	  } else {
		const updatedStats = await res.json();
		console.log('Balance refueled in DB:', updatedStats);
	  }
	} catch (err) {
	  console.error('Error refueling:', err);
	}
};
  
export const baseColors = [
	"green", "red", "black", "red", "black", "red", "black", "red", "black", 
	"red", "black", "red", "black", "red", "black"
  ];

export const baseNumbers = Array.from({ length: 15 }, (_, i) => i);
  
export const slotWidth = 80;
export const visibleSlots = 11;
export const centerSlot = Math.floor(visibleSlots / 2);
export const repeatCount = 15;
export const safeLoopZone = baseNumbers.length * 2;
  
export const buildSlotArray = () => {
	const result: number[] = [];
	for (let i = 0; i < repeatCount; i++) {
	  result.push(...baseNumbers);
	}
	return result;
};

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