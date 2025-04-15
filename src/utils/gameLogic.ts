import { useState } from "react";

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

