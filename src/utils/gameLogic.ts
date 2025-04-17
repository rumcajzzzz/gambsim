import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";

// Constants that can be moved outside the hook since they don't change
const TIME_ROUND_LENGTH = 6; // Round length (seconds)
const BET_BLOCK_TIME = 1; // Bet block time (seconds)
const BASE_COLORS = [
  "green", "red", "black", "red", "black", "red", "black", "red", "black", 
  "red", "black", "red", "black", "red", "black"
];
const BASE_NUMBERS = Array.from({ length: 15 }, (_, i) => i);
const SLOT_WIDTH = 80;
const VISIBLE_SLOTS = 11;
const CENTER_SLOT = Math.floor(VISIBLE_SLOTS / 2);
const REPEAT_COUNT = 15;
const SAFE_LOOP_ZONE = BASE_NUMBERS.length * 2;

export const useGameLogic = () => {
  const [points, setPoints] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [betColor, setBetColor] = useState<string | null>(null);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [bets, setBets] = useState({
    red: 0,
    green: 0,
    black: 0
  });
  const [showRefuel, setShowRefuel] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_ROUND_LENGTH); 
  const [canBet, setCanBet] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [logicalIndex, setLogicalIndex] = useState(0);
  const [, setRolledSlot] = useState<number | null>(null);

  return {
    points, setPoints,
    betAmount, setBetAmount,
    betColor, setBetColor,
    rollHistory, setRollHistory,
    bets, setBets,
    showRefuel, setShowRefuel,
    timeLeft, setTimeLeft,
    canBet, setCanBet,
    isRolling, setIsRolling,
    logicalIndex, setLogicalIndex,
    setRolledSlot,
    constants: {
      TIME_ROUND_LENGTH,
      BET_BLOCK_TIME,
      BASE_COLORS,
      BASE_NUMBERS,
      SLOT_WIDTH,
      CENTER_SLOT,
      SAFE_LOOP_ZONE
    }
  };
};

export const useSlotAudio = () => {
  const slotRollAudioRef = useRef<HTMLAudioElement | null>(null);
  const slotLandAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const playSound = (type: "roll" | "land") => {
    if (!audioUnlocked) return;
    const audioRef = type === "roll" ? slotRollAudioRef.current : slotLandAudioRef.current;
    audioRef?.play().catch(() => {});
  };

  useEffect(() => {
    const unlockAudio = () => {
      if (audioUnlocked) return;
      
      slotRollAudioRef.current = new Audio("./assets/mp3/slotroll.mp3");
      slotLandAudioRef.current = new Audio("./assets/mp3/slotland.mp3");
      slotRollAudioRef.current.muted = true;

      slotRollAudioRef.current.play()
        .then(() => {
          setTimeout(() => {
            if (slotRollAudioRef.current) slotRollAudioRef.current.muted = false;
            setAudioUnlocked(true);
          }, 2000);
        })
        .catch(() => setAudioUnlocked(true));

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, [audioUnlocked]);

  return { playSound };
};

const updateUserStats = async (updateData: { amountChange?: number; setBalance?: number }) => {
  try {
    const res = await fetch("/api/user-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      console.error("Failed to update user stats");
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Error updating user stats:", err);
    return null;
  }
};

export const handleBetResult = async (
  rolledSlotIndex: number,
  points: number,
  setPoints: (points: number) => void,
  bets: { red: number; green: number; black: number },
  setShowRefuel: (show: boolean) => void
) => {
  const rolledColor = BASE_COLORS[rolledSlotIndex];
  let winnings = 0;

  if (rolledColor === "green" && bets.green > 0) {
    winnings = bets.green * 14;
  } else if (rolledColor === "red" && bets.red > 0) {
    winnings = bets.red * 2;
  } else if (rolledColor === "black" && bets.black > 0) {
    winnings = bets.black * 2;
  }

  const newPoints = points + winnings;
  setPoints(newPoints);
  setShowRefuel(newPoints === 0);

  if (winnings > 0) {
    await updateUserStats({ amountChange: winnings });
  }
};

export const roll = async (
  gameState: ReturnType<typeof useGameLogic>,
  controls: any,
  playSound: (type: "roll" | "land") => void
) => {
  const {
    points, setPoints,
    setIsRolling,
    setBetAmount,
    logicalIndex, setLogicalIndex,
    setRolledSlot,
    setRollHistory,
    setTimeLeft,
    setBets,
    bets,
    setShowRefuel,
    constants: {
      BASE_NUMBERS,
      CENTER_SLOT,
      SLOT_WIDTH,
      SAFE_LOOP_ZONE,
      TIME_ROUND_LENGTH
    }
  } = gameState;

  setIsRolling(true);
  setBetAmount(0);
  playSound("roll");

  const loops = 6;
  const extraSteps = Math.floor(Math.random() * BASE_NUMBERS.length);
  const newIndex = logicalIndex + loops * BASE_NUMBERS.length + extraSteps;
  const rolledSlotIndex = newIndex % BASE_NUMBERS.length;
  
  setRolledSlot(rolledSlotIndex);

  await controls.start({
    x: -(newIndex - CENTER_SLOT) * SLOT_WIDTH,
    transition: { duration: 8, ease: [0.05, 0.9999, 0.999999999, 1] },
  });

  const newSafeIndex = SAFE_LOOP_ZONE + (newIndex % BASE_NUMBERS.length);
  controls.set({ x: -(newSafeIndex - CENTER_SLOT) * SLOT_WIDTH });
  setLogicalIndex(newSafeIndex);

  playSound("land");

  setRollHistory(prev => [rolledSlotIndex, ...prev.slice(0, 9)]);
  
  setTimeout(() => {
    setTimeLeft(TIME_ROUND_LENGTH);
    setIsRolling(false);
    setBets({ red: 0, green: 0, black: 0 });
  }, 500);

  await handleBetResult(
    rolledSlotIndex,
    points,
    setPoints,
    bets,
    setShowRefuel
  );
};

export const refuel = async (
  setPoints: Dispatch<SetStateAction<number>>, 
  setShowRefuel: Dispatch<SetStateAction<boolean>>
) => {
  const newBalance = 1000;
  setPoints(newBalance);
  setShowRefuel(false);
  await updateUserStats({ setBalance: newBalance });
};

export const buildSlotArray = () => {
  return Array(REPEAT_COUNT).fill(BASE_NUMBERS).flat();
};

export const updateBalance = async (
  bet: number,
  points: number,
  setPoints: Dispatch<SetStateAction<number>>
) => {
  if (bet <= 0 || bet > points) return;

  setPoints(prev => prev - bet);
  await updateUserStats({ amountChange: -bet });
};

export const placeBet = (
  color: string,
  betAmount: number,
  points: number,
  setPoints: Dispatch<SetStateAction<number>>, 
  setBetColor: (color: string) => void,
  setBets: Dispatch<SetStateAction<{ red: number; green: number; black: number }>>
) => {
  if (betAmount <= 0 || betAmount > points) return;

  updateBalance(betAmount, points, setPoints);
  setBetColor(color);
  setBets(prev => ({ ...prev, [color]: prev[color as keyof typeof prev] + betAmount }));
};