"use client";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

const baseColors = [
  "green", "red", "black", "red", "black", "red", "black", "red", "black", 
  "red", "black", "red", "black", "red", "black"
];
const baseNumbers = Array.from({ length: 15 }, (_, i) => i);
const slotWidth = 80;
const visibleSlots = 11;
const centerSlot = Math.floor(visibleSlots / 2);
const repeatCount = 10;
const safeLoopZone = baseNumbers.length * 2;

const buildSlotArray = () => {
  const result = [];
  for (let i = 0; i < repeatCount; i++) {
    result.push(...baseNumbers);
  }
  return result;
};

export default function Home() {
  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play();
  };
  const timeRoundLength = 5;
  const slots = buildSlotArray();
  const controls = useAnimation();
  
  const [timeLeft, setTimeLeft] = useState(timeRoundLength);
  const [canBet, setCanBet] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [logicalIndex, setLogicalIndex] = useState(0);
  
  const [rolledSlot, setRolledSlot] = useState<number | null>(null);
  const [points, setPoints] = useState(1000);
  const [betAmount, setBetAmount] = useState(0);
  const [betColor, setBetColor] = useState<string | null>(null);
  const [rollHistory, setRollHistory] = useState<number[]>([]);

  const [redBet, setRedBet] = useState(0);
  const [greenBet, setGreenBet] = useState(0);
  const [blackBet, setBlackBet] = useState(0);

  

  useEffect(() => {
    const initialIndex = safeLoopZone + centerSlot;
    setLogicalIndex(initialIndex);
  }, []);

  useEffect(() => {
    if (isRolling || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        if (next <= 2) setCanBet(false);
        else setCanBet(true);

        if (next <= 0) {
          clearInterval(interval);
          setCanBet(false);
          roll();
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isRolling]);

  const roll = async () => {
    setIsRolling(true);
    playSound("./assets/mp3/slotroll.mp3");

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

    const viewReset = () => {
      const newSafeIndex = safeLoopZone + (newIndex % baseNumbers.length);
      controls.set({ x: -(newSafeIndex - centerSlot) * slotWidth });
      setLogicalIndex(newSafeIndex);
    };

    playSound("./assets/mp3/slotland.mp3");
    viewReset();

    

    setRollHistory((prevHistory) => {
      const newHistory = [rolledSlotIndex, ...prevHistory];
      return newHistory.slice(0, 10);
    });

    setTimeout(() => {
      setTimeLeft(timeRoundLength);
      setIsRolling(false);
    }, 500);
    if (betColor !== null) {
      handleBetResult(rolledSlotIndex);
    }
  };

  const handleBetResult = (rolledSlotIndex: number) => {
    let newPoints = points;
    if (baseColors[rolledSlotIndex] === "green" && greenBet > 0) {
      newPoints += greenBet * 14;
    } else if (baseColors[rolledSlotIndex] === "red" && redBet > 0) {
      newPoints += redBet * 2;
    } else if (baseColors[rolledSlotIndex] === "black" && blackBet > 0) {
      newPoints += blackBet * 2;
    } else {
      newPoints -= redBet + greenBet + blackBet;
    }

    if (newPoints < 0) {
      newPoints = 0;
    }

    setPoints(newPoints);

    setRedBet(0);
    setGreenBet(0);
    setBlackBet(0);
  };

  const updateBalance = (bet: number) => {
    setPoints(prevPoints => prevPoints - bet);
  }
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-[880px] overflow-hidden border-2 border-gray-300 rounded-xl">
        <div className="mt-4 text-2xl font-bold  text-center mb-5">
          {isRolling ? "Rolling..." : `Next roll in: ${timeLeft}s`}
        </div>

        <motion.div className="flex w-max" animate={controls}>
          {slots.map((num, i) => {
            const color = baseColors[num % 15];
            return (
              <div
                key={`${i}-${num}`}
                className={`w-20 h-20 flex items-center justify-center text-white font-bold text-xl ${
                  color === "green"
                    ? "bg-green-600"
                    : color === "red"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {num}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold  text-center">Last 10 Rolls:</h2>
        <div className="flex flex-wrap gap-2">
          {rollHistory.map((slotIndex, i) => (
            <div
              key={i}
              className={`w-12 h-12 flex items-center justify-center text-white font-bold text-lg ${
                baseColors[slotIndex] === "green"
                  ? "bg-green-600"
                  : baseColors[slotIndex] === "red"
                  ? "bg-red-600"
                  : "bg-black"
              }`}
            >
              {slotIndex}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center m-12 text-xl font-semibold ">

        <p className="px-15 py-6 rounded m-5 text-center border border-gray-300">
          Points: {points < 0 ? 0 : points}
        </p>

        <div 
            className="flex px-6 py-6 mr-4 rounded border border-gray-300"
        >
          <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
          className="w-60 outline-none text-4xl"
          placeholder="Enter Bet Amount"
          />

          <div className="flex-col">
            <button
              onClick={() => {setBetAmount(0)}}
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
              onClick={() => setBetAmount(points)}
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
          onClick={() => {
            updateBalance(betAmount);
            setBetColor("red");
            setRedBet(betAmount);
          }}
          className={`bg-red-600 text-white px-6 py-2 rounded-xl border-2 ${
            betColor === "red" ? "border-yellow-500" : "border-transparent"
          } hover:bg-red-800 hover:cursor-pointer transition ${!canBet ? "opacity-50 !cursor-not-allowed" : ""}`}
        >
          Red
        </button>
        <button
          onClick={() => {
            updateBalance(betAmount);
            setBetColor("green");
            setGreenBet(betAmount);
          }}
          className={`bg-green-600 text-white px-6 py-2 rounded-xl border-2 ${
            betColor === "green" ? "border-yellow-500" : "border-transparent"
          } hover:bg-green-800 hover:cursor-pointer transition ${!canBet ? "opacity-50 !cursor-not-allowed" : ""}`}
        >
          Green
        </button>
        <button
          onClick={() => {
            updateBalance(betAmount);
            setBetColor("black");
            setBlackBet(betAmount);
          }}
          className={`bg-black text-white px-6 py-2 rounded-xl border-2 ${
            betColor === "black" ? "border-yellow-500" : "border-transparent"
          } hover:bg-gray-800 hover:cursor-pointer transition ${!canBet ? "opacity-50 !cursor-not-allowed" : ""}`}
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

    </main>
  );
}
