"use client";
import "@/styles/socketclient.css";
import Link from "next/link";

import { useAnimation } from 'framer-motion';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { buildSlotArray, useSound } from '@/utils/gameLogic';
import io, { Socket } from "socket.io-client";

import Slider from '@/components/slotBar';

export const SocketClient = () => {
  const controls = useAnimation();
  const slots = buildSlotArray();
  const playSpinSound = useSound('/assets/mp3/spin.mp3');
  const playEndRoundSound = useSound('/assets/mp3/roundend.mp3');

  interface UserBets {
    points: number;
    redBet: number;
    greenBet: number;
    blackBet: number;
    showRefuel: boolean;
  }

  const [localUser, setLocalUser] = useState<UserBets | null>(null);
  const [balance, setBalance] = useState(0);
  const [roll, setRoll] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState<"waiting" | "rolling" | "result" | "suspended">("waiting");
  const [winningColor, setWinningColor] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [showRefuel, setShowRefuel] = useState<boolean | null>(null);
  const [currentBets, setCurrentBets] = useState({ red: 0, green: 0, black: 0 });
  const [bets, setBets] = useState({
    red: [] as { username: string; amount: number; profile_image_url: string }[],
    green: [] as { username: string; amount: number; profile_image_url: string }[],
    black: [] as { username: string; amount: number; profile_image_url: string }[],
  });
  const [slotOffset, setSlotOffset] = useState(0);
  const [roundEnd, setRoundEnd] = useState<number | null>(null);
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  const { user } = useUser();

  const slotWidth = 80; 
  const centerSlot = 10;
  const positionOffset = 5;

  useEffect(() => {
    controls.set({ x: -(centerSlot * slotWidth) }); 
  }, []);
  
  useEffect(() => {

    const socketInstance = io("https://gambsim-backend.onrender.com", {
      transports: ["websocket"],
    });

    setSocket(socketInstance)
    socketInstance.emit("getCurrentBets", user?.id);

    socketInstance.on("currentBets", (data: any) => {
      const mapBets = (betsObj: any) => {
        if (!betsObj) return [];
        return Object.values(betsObj).map((b: any) => ({
          username: b.username,
          amount: b.amount,
          profile_image_url: b.profile_image_url || "/default-avatar.png",
        }));
      };
    
      setBets({
        red: mapBets(data.red),
        green: mapBets(data.green),
        black: mapBets(data.black),
      });
    
      setCurrentBets(data.userBets);
    });
    
    socketInstance.emit("userClerkData", {
       userId: user?.id,
       username: user?.username,
       email: user?.emailAddresses?.[0]?.emailAddress,
       first_name: user?.firstName,
       last_name: user?.lastName,
       profile_image_url: user?.imageUrl,
    })

    socketInstance.on("initialState", (data: any) => {
      setBalance(data.points);
      setRollHistory(data.rollHistory);
      setPhase(data.status);
      setShowRefuel(data.showRefuel);
      setCurrentBets(data.globalBets);
      if (data.roundEnd) setCountdown(Math.max(0, Math.ceil((data.roundEnd - Date.now()) / 1000)));
    });

    socketInstance.on("betsUpdated", (bets: { red: number; green: number; black: number }) => {
      setCurrentBets(bets);
    });

    socketInstance.on("newRoll", async (roll: number[]) => {
      setRoll(roll[0]);
      setSlotOffset(0);
      setWinningColor(roll[0] === 0 ? 'green' : roll[0] % 2 === 1 ? 'red' : 'black');
      setBets({ red: [], green: [], black: [] });
      setRollHistory(roll);
      setTimeout(() => setWinningColor(""), 2000);
      playEndRoundSound();
    });

    socketInstance.on('slotOffset', (offset: number) => {
      setSlotOffset(offset);
    });
    
    socketInstance.on("balanceUpdated", (newBalance: number) => {
      setBalance(newBalance);
    });

    socketInstance.on("status", (statusData: { phase: string; roundEnd?: number }) => {
      setPhase(statusData.phase as any);
    
      if (statusData.roundEnd) {
        setCountdown(Math.max(0, Math.ceil((statusData.roundEnd - Date.now()) / 1000)));
      }
    
      if (statusData.phase === "rolling") {
        setWinningColor("");
        setTimeout(() => playSpinSound(), 2000);
      }
    });
    
    socketInstance.on('countdown', (seconds: number) => {
      setCountdown(seconds);
    });

    socketInstance.on("userBets", (user: UserBets) => {
      setLocalUser(user);
    });
    
    socketInstance.on("publicBetPlaced", (data: { 
      username: string; 
      amount: number;
      color: "red" | "green" | "black"; 
      profile_image_url: string 
      }) => {
          setBets(prev => {
            const updated = { ...prev };
            const existing = updated[data.color].find(b => b.username === data.username);
        
            if (existing) {
              existing.amount = data.amount;
            } else {
              updated[data.color].push({
                username: data.username,
                amount: data.amount,
                profile_image_url: data.profile_image_url,
              });
            }
        
            return updated;
          });
    });

    socketInstance.on('showRefuel', (temp: boolean) => {
      setShowRefuel(temp);
      
    });

    socketInstance.on("playerUpdated", (data: { balance: number; refueled?: boolean }) => {
      setBalance(data.balance);
      setLocalUser(prev => prev ? { ...prev, points: data.balance } : prev);
  
      if (data.refueled) setShowRefuel(false);
    });

    socketInstance.on("userBetUpdate", (data: { redBet: number; greenBet: number; blackBet: number }) => {
      setLocalUser(prev => prev ? {
        ...prev,
        redBet: data.redBet,
        greenBet: data.greenBet,
        blackBet: data.blackBet,
      } : {
        redBet: data.redBet,
        greenBet: data.greenBet,
        blackBet: data.blackBet,
        points: 0,
        showRefuel: false,
      });
    });
    

    return () => {
      socketInstance.disconnect();
    };

  }, [user?.id]);
  
  useEffect(() => {
    if (!roundEnd) return;

    const interval = setInterval(() => {
      setCountdown(Math.max(0, Math.ceil((roundEnd - Date.now()) / 1000)));
    }, 250);

    return () => clearInterval(interval);
  }, [roundEnd]);

  const placeBet = (color: "red" | "green" | "black") => {
    if (phase !== "waiting" || betAmount <= 0 || betAmount > balance) return;

    socket?.emit("placeBet", {  
      color,
      amount: betAmount,
      username: user?.username || user?.firstName || "Anonymous",
      profile_image_url: user?.imageUrl || null,
    });
  };

  const handleRefresh = () => {
    if (socket && !refreshing) {
      setRefreshing(true);
      socket.emit("getBalance");
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const handleRefuel = () => {
    socket?.emit("refuel");
    setShowRefuel(false);
  };
  
  return (
    <div className="container">
      <div className="socket-client-container">
        <div className="phase-info my-2">
          {phase === "waiting" && countdown !== null ? (
            <p>Rolling in: {countdown}s</p>
          ) : phase === "rolling" ? (
            <p>Rolling...</p>
          ) : phase === "suspended" ? (
            <p>🛠️ The roulette system is temporarily closed for maintenance. 🛠️</p>
          ) : (
            <p>Result shown!</p>
          )}
        </div>

        <Slider />

        <div className="roll-history">
          <ul className="flex mx-50">
            <p className="history-text">HISTORY</p>
            {Array.isArray(rollHistory) && rollHistory.length === 0 ? (
              <li
                className="history-tile loading-tile text-transparent flex justify-center items-center w-12 h-12 px-4 py-2 rounded mx-1"
              >
              </li>
            ) : (
              rollHistory.map((num, idx) => {
                const getBgColor = (n: number) => {
                  if (n === 0) return 'history-green-tile';
                  if (n % 2 === 1) return 'history-red-tile';
                  return 'history-black-tile';
                };
                return (
                  <li
                    key={idx}
                    className={`history-tile text-white flex justify-center items-center w-12 h-12 px-4 py-2 rounded mx-1  ${getBgColor(num)}`}
                  >
                    {num}
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="game-info">
          <div className="balance-display">
          <h2>Balance: </h2>
          <h2>{refreshing ? "..." : balance}</h2>
            {showRefuel && phase === "waiting" ? (
                <button className="refuel-button" onClick={handleRefuel}>
                  <img src="/refuelicon.svg" alt="refuel icon" className='w-10 h-10 aspect-square invert' />
                </button>
              ) : (
                <button className="balance-refresh-button" onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? <span className="animate-spin">↻</span> : "↻"}
                </button>
            )}
          </div>
          <div className="betinput-buttons">
            <input type="number" placeholder="Enter bet amount..." className="bet-input" value={betAmount || ""} onChange={(e) => setBetAmount(Number(e.target.value))} min={0} />
            <button onClick={() => setBetAmount(0)}>CLEAR</button>
            <button onClick={() => setBetAmount((prev) => prev + 10)}>+10</button>
            <button onClick={() => setBetAmount((prev) => prev + 100)}>+100</button>
            <button onClick={() => setBetAmount((prev) => prev + 1000)}>+1000</button>
            <button onClick={() => setBetAmount((prev) => Math.floor(prev / 2))}>1/2</button>
            <button onClick={() => setBetAmount((prev) => prev * 2)}>2X</button>
            <button onClick={() => setBetAmount(balance)}>MAX</button>
          </div>
        </div>
      
        <div className="bet-columns">
          {[...Object.entries(currentBets)].map(([color, amount]) => (
            <div
              key={color}
              className={`bet-column ${color} ${
                winningColor && winningColor !== color
                  ? "bet-column-fade"
                  : ""
              }`}
            >
              <button
                onClick={() => placeBet(color as "red" | "green" | "black")}
                disabled={phase !== "waiting"}
                className={`${color}-button`}
              >
                Bet {color.charAt(0).toUpperCase() + color.slice(1)}
              </button>
              <h4 className="user-bet my-2">
                {localUser ? {
                  red: localUser.redBet,
                  green: localUser.greenBet,
                  black: localUser.blackBet
                }[color] : 0}
              </h4>

              <div className="global-bet-info flex items-center justify-between px-8 py-2">
                <div className="flex items-center space-x-4">
                  <img
                    className="w-10 h-10 rounded-full"
                    src="/user.svg"
                    alt="Users icon"
                  />
                  <p className="text-white">{bets[color as "red" | "green" | "black"]?.length || 0}</p>
                </div>
                <p className="text-gray-500">
                  Total bet:{" "}
                  <span className="text-white">
                    {bets[color as "red" | "green" | "black"]
                      ? bets[color as "red" | "green" | "black"].reduce(
                          (sum, bet) => sum + bet.amount,
                          0
                        )
                      : 0}
                  </span>
                </p>
              </div>

              <div className="bet-list">
                {(!bets[color as "red" | "green" | "black"] || bets[color as "red" | "green" | "black"].length === 0) ? (
                  <div className="flex justify-center items-center h-10 w-full animate-pulse text-gray-400">
                    Loading bets...
                  </div>
                ) : 
                  (
                    bets[color as "red" | "green" | "black"]
                      .sort((a, b) => b.amount - a.amount)
                      .map((bet, idx) => (
                        <div key={idx} className="bet-item">
                          <Link href={`/profile/${bet.username}`} target="_blank">
                            <div className="flex cursor-pointer items-center gap-2">
                              <img
                                src={bet.profile_image_url || "/default-avatar.png"}
                                alt={bet.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <span>{bet.username}</span>
                            </div>
                          </Link>
                          <span className="bet-amount">{bet.amount}</span>
                        </div>
                      ))
                  )
                }
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );

};