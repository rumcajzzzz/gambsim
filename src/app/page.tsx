"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { 
  baseColors, slotWidth,
  centerSlot, safeLoopZone, buildSlotArray, 
  useGameLogic,
  betBlockTime
} from "@/utils/gameLogic";
import { useUserBalance } from "@/utils/backend/fetchUserBalance";

export default function Home() {
  
  const {

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

  } = useGameLogic();
  
  const slots = buildSlotArray();
  const controls = useAnimation();
  const initialBalanceValue = useUserBalance();

  useEffect(() => {
    if (initialBalanceValue !== null) {
      setPoints(initialBalanceValue);
    }
  }, [initialBalanceValue, setPoints]);

  useEffect(() => {
    const initialIndex = safeLoopZone + centerSlot;
    controls.set({ x: -(initialIndex - centerSlot) * slotWidth });
  }, [controls]);

  useEffect(() => {
    if (isRolling || timeLeft <= 0) return;
    
  const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        
        if (next <= 0) {
          clearInterval(timer);
          setCanBet(false);
          if (!isRolling) {
            roll(controls);
          }
        } else if (next <= betBlockTime) {
          setCanBet(false);
        } else {
          setCanBet(true);
        }
        
        return next;
      });
  }, 1000);

  return () => clearInterval(timer);
   }, [timeLeft, isRolling, setTimeLeft, setCanBet, roll, controls]);

return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-[880px] overflow-hidden border-2 border-gray-300 rounded-xl">
        <div className="mt-4 text-2xl font-bold text-center mb-5">
          {isRolling ? "Rolling..." : `Next roll in: ${timeLeft}s`}
        </div>

        <motion.div className="flex w-max" animate={controls}>
          {slots.map((num, i) => {
            const color = baseColors[num % 15];
            return (
              <div
                key={`${i}-${num}`}
                className={`w-20 h-20 flex items-center justify-center text-white font-bold text-xl ${
                  color === "green" ? "bg-green-600" :
                  color === "red" ? "bg-red-600" : "bg-black"
                }`}
              >
                {num}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-center">Last 10 Rolls:</h2>
        <div className="flex flex-wrap gap-2">
          {rollHistory.map((slotIndex, i) => (
            <div
              key={i}
              className={`w-12 h-12 flex items-center justify-center text-white font-bold text-lg ${
                baseColors[slotIndex] === "green" ? "bg-green-600" :
                baseColors[slotIndex] === "red" ? "bg-red-600" : "bg-black"
              }`}
            >
              {slotIndex}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center m-12 text-xl font-semibold">
        <p className="text-red-300 text-2xl px-15 py-11 rounded m-5 text-center border border-gray-300">
          Balance: {points}
        </p>

        <div className="flex px-6 py-6 mr-4 rounded border border-gray-300">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
            className="w-60 outline-none text-4xl"
            placeholder="Enter Bet Amount"
          />

          <div className="flex-col">
            <button
              onClick={() => setBetAmount(0)}
              className="m-4 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition hover:cursor-pointer"
            >
              Clear Bet
            </button>
            <button
              onClick={() => setBetAmount(Math.round(betAmount / 2))}
              className="m-4 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition hover:cursor-pointer"
            >
              1/2
            </button>
            <button
              onClick={() => points > 0 && setBetAmount(points)}
              className="m-4 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition hover:cursor-pointer"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center items-center space-x-6">
        <button
          disabled={!canBet}
          onClick={() => placeBet("red", betAmount)}
          className={`bg-red-600 text-white px-6 py-2 rounded-xl border-2 ${
            betColor === "red" ? "border-yellow-500" : "border-transparent"
          } ${canBet ? "hover:bg-red-800 hover:cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
        >
          Red
        </button>
        <button
          disabled={!canBet}
          onClick={() => placeBet("green", betAmount)}
          className={`bg-green-600 text-white px-6 py-2 rounded-xl border-2 ${
            betColor === "green" ? "border-yellow-500" : "border-transparent"
          } ${canBet ? "hover:bg-green-800 hover:cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
        >
          Green
        </button>
        <button
          disabled={!canBet}
          onClick={() => placeBet("black", betAmount)}
          className={`bg-black text-white px-6 py-2 rounded-xl border-2 ${
            betColor === "black" ? "border-yellow-500" : "border-transparent"
          } ${canBet ? "hover:bg-gray-800 hover:cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
        >
          Black
        </button>
      </div>

      <div className="mt-6 flex justify-center space-x-6">
        <div>
          <p>Red Bet: {redBet}</p>
        </div>
        <div>
          <p>Green Bet: {greenBet}</p>
        </div>
        <div>
          <p>Black Bet: {blackBet}</p>
        </div>
      </div>

      {showRefuel && !isRolling && (
        <div className="mt-6 text-center">
          <button
            onClick={refuel}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition"
          >
            Refuel
          </button>
        </div>
      )}
    </main>
  );
}