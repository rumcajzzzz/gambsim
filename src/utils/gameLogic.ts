import { useState } from "react";
import { AnimationControls } from "framer-motion";

// Constants
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
export const timeRoundLength = 6;
export const betBlockTime = 1;

// Helper functions
export const buildSlotArray = () => {
  const result: number[] = [];
  for (let i = 0; i < repeatCount; i++) {
    result.push(...baseNumbers);
  }
  return result;
};

export const audio = (filename: string) => {
  const sound = new Audio(`/assets/mp3/${filename}.mp3`);
  sound.currentTime = 0;
  return {
    play: () => sound.play().catch(console.error),
    pause: () => sound.pause(),
    sound
  };
};

// Main game logic hook
export const useGameLogic = () => {
  // State
  const [points, setPoints] = useState(1000);
  const [betAmount, setBetAmount] = useState(0);
  const [betColor, setBetColor] = useState<string | null>(null);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [redBet, setRedBet] = useState(0);
  const [greenBet, setGreenBet] = useState(0);
  const [blackBet, setBlackBet] = useState(0);
  const [showRefuel, setShowRefuel] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeRoundLength);
  const [canBet, setCanBet] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [logicalIndex, setLogicalIndex] = useState(0);
  const [rolledSlot, setRolledSlot] = useState<number | null>(null);

  const updateBalance = async (amountChange: number, setBalance?: number) => {
    try {
      const res = await fetch('/api/user-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setBalance !== undefined 
          ? { setBalance }
          : { amountChange }
        ),
      });

      if (!res.ok) throw new Error('Failed to update balance');
      return await res.json();
    } catch (err) {
      console.error('API Error:', err);
      return null;
    }
  };

  // Game actions
  const handleBetResult = async (rolledSlotIndex: number) => {
    let newPoints = points;
    const color = baseColors[rolledSlotIndex];

    if (color === "green" && greenBet > 0) {
      newPoints += greenBet * 14;
    } else if (color === "red" && redBet > 0) {
      newPoints += redBet * 2;
    } else if (color === "black" && blackBet > 0) {
      newPoints += blackBet * 2;
    }

    const finalPoints = Math.max(newPoints, 0);
    setPoints(finalPoints);
    setShowRefuel(finalPoints === 0);

    if (redBet > 0 || greenBet > 0 || blackBet > 0) {
      await updateBalance(finalPoints - points);
    }
  };

  const roll = async (controls: AnimationControls) => {
    setIsRolling(true);
    setBetAmount(0);
    // audio("slotroll").play();

    const loops = 6;
    const extraSteps = Math.floor(Math.random() * baseNumbers.length);
    const newIndex = logicalIndex + loops * baseNumbers.length + extraSteps;
    const rolledSlotIndex = newIndex % baseNumbers.length;
    
    await controls.start({
      x: -(newIndex - centerSlot) * slotWidth,
      transition: { duration: 8, ease: [0.05, 0.9999, 0.999999999, 1] },
    });

    const newSafeIndex = safeLoopZone + (newIndex % baseNumbers.length);
    controls.set({ x: -(newSafeIndex - centerSlot) * slotWidth });
    
    setLogicalIndex(newSafeIndex);
    setRolledSlot(rolledSlotIndex);
    setRollHistory(prev => [rolledSlotIndex, ...prev.slice(0, 9)]);

    setTimeout(() => {
      setTimeLeft(timeRoundLength);
      setIsRolling(false);
      setRedBet(0);
      setGreenBet(0);
      setBlackBet(0);
    }, 500);

    // audio("slotland").play();
    handleBetResult(rolledSlotIndex);
  };

  const placeBet = (color: string, amount: number) => {
    if (amount <= 0 || amount > points) return;

    setPoints(p => p - amount);
    setBetColor(color);
    
    switch (color) {
      case "red": setRedBet(p => p + amount); break;
      case "green": setGreenBet(p => p + amount); break;
      case "black": setBlackBet(p => p + amount); break;
    }

    updateBalance(-amount);
  };

  const refuel = async () => {
    const newBalance = 1000;
    setPoints(newBalance);
    setShowRefuel(false);
    await updateBalance(0, newBalance);
  };

  return {
    // State
    points,
    betAmount,
    betColor,
    rollHistory,
    redBet,
    greenBet,
    blackBet,
    showRefuel,
    timeLeft,
    canBet,
    isRolling,

    // Setters
    setPoints,
    setBetAmount,
    setTimeLeft,
    setCanBet,
    
    // Actions
    roll,
    placeBet,
    refuel
  };
};