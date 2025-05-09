"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import "../styles/socketclient.css";

export const SocketClient = () => {
  
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
  const [phase, setPhase] = useState<"waiting" | "rolling" | "result">("waiting");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [showRefuel, setShowRefuel] = useState<boolean | null>(null);
  const [currentBets, setCurrentBets] = useState({
    red: 0,
    green: 0,
    black: 0,
  });
  const [bets, setBets] = useState({
    red: [] as { username: string; amount: number; profile_image_url: string }[],
    green: [] as { username: string; amount: number; profile_image_url: string }[],
    black: [] as { username: string; amount: number; profile_image_url: string }[],
  });

  const { user } = useUser();

  useEffect(() => {
    const socketInstance = io("http://localhost:3001/")
    
    socketInstance.on("connect", () => {
      setConnected(true);
      if (user?.id) socketInstance.emit("userClerkId", user.id);
    })

    socketInstance.on("currentBetData", (data: any) => {
      setBets({
        red: Object.values(data.red || {}),
        green: Object.values(data.green || {}),
        black: Object.values(data.black || {}),
      });
    });

    setSocket(socketInstance)

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
      setCountdown(data.timeLeft);
      setCurrentBets(data.globalBets);
    })

    socketInstance.on("betsUpdated", (bets: { red: number; green: number; black: number }) => {
      setCurrentBets(bets);
    })

    socketInstance.on("balanceUpdated", (newBalance: number) => {
      setBalance(newBalance);
    })

    socketInstance.on("newRoll", (roll: number[]) => {
      setRoll(roll[0]);
      setBets({red: [], green: [], black: []})
      setRollHistory(roll);
    })

    socketInstance.on("status", (status: "waiting" | "rolling") => {
      setPhase(status);

      if (status === "waiting") {
        setCurrentBets({ red: 0, green: 0, black: 0 }); 
        setCountdown(10);
      }
      else if (status === "rolling") {
        setCountdown(null);
        }
    })

    socketInstance.on("userBets", (user: UserBets) => {
      setLocalUser(user);
    })

    socketInstance.on("showRefuel", (show: boolean) => {
      setShowRefuel(show);
    })

    socketInstance.on("publicBetPlaced", (data: { username: string; amount: number; color: "red" | "green" | "black"; profile_image_url: string }) => {
      setBets((prevBets) => {
        const updatedBets = { ...prevBets };
        const existingBet = updatedBets[data.color].find(bet => bet.username === data.username);
        if (existingBet) {
          existingBet.amount += data.amount;
        } else {
          updatedBets[data.color].push({
            username: data.username,
            amount: data.amount,
            profile_image_url: data.profile_image_url,
          });
        }
        return updatedBets;
      });
    });

    return () => {
      socketInstance.disconnect();
    }

  }, [user?.id])

  useEffect(() => {
    if (phase === "waiting" && countdown !== null && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown, phase]);
  
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
    socket?.emit("refuel", false);
  };

  return (
    <div className="socket-client-container">

      <div className="phase-info my-4">
        {phase === "waiting" && countdown !== null ? (
          <p>Rolling in: {countdown}s</p>
        ) : phase === "rolling" ? (
          <p>Rolling...</p>
        ) : (
          <p>Result shown!</p>
        )}
      </div>

      <div className="roll-history">
        <h4>Last 10 Rolls: </h4>
        <ul className="flex mx-50">
          {Array.isArray(rollHistory) &&
            rollHistory.map((num, idx) => {
              const getBgColor = (n: number) => {
                if (n === 0) return 'bg-green-500';
                if (n % 2 === 1) return 'bg-red-500';
                return 'bg-black';
              };
              return (
                <li
                  key={idx}
                  className={`text-white flex justify-center items-center w-12 h-12 px-4 py-2 rounded mx-1 ${getBgColor(num)}`}
                >
                  {num}
                </li>
              );
            })}
        </ul>
      </div>

      <div className="game-info">
        <div className="balance-display">
          <h2>Balance: </h2>
          <h2>{refreshing && "..." || balance}</h2>
          <button className="balance-refresh-button" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <span className="animate-spin">↻</span> : "↻"}
          </button>
        </div>
        <div className="betinput-buttons">
          <input type="number" placeholder="Enter bet amount..." className="bet-input" value={betAmount || ""} onChange={(e) => setBetAmount(Number(e.target.value))} min={0} />
          <button onClick={() => setBetAmount(0)}>Clear</button>
          <button onClick={() => setBetAmount((prev) => prev + 10)}>+10</button>
          <button onClick={() => setBetAmount((prev) => prev + 100)}>+100</button>
          <button onClick={() => setBetAmount((prev) => prev + 1000)}>+1000</button>
          <button onClick={() => setBetAmount((prev) => Math.floor(prev / 2))}>1/2</button>
          <button onClick={() => setBetAmount((prev) => prev * 2)}>2X</button>
          <button onClick={() => setBetAmount(balance)}>Max</button>
        </div>
      </div>
          
      <div className="bet-columns">
          {[...Object.entries(currentBets)].map(([color, amount]) => (
            <div key={color} className={`bet-column ${color}`}>
              <button
                  onClick={() => placeBet(color as "red" | "green" | "black")}
                  disabled={phase !== "waiting"}
                  className={`${color}-button`}
                >
                  Bet {color.charAt(0).toUpperCase() + color.slice(1)}
              </button>

              <h4 className="user-bet my-2">
                {localUser ? localUser[`${color}Bet` as keyof typeof localUser] : 0}
              </h4>
              <div className="global-bet-info flex items-center justify-between px-8 py-2">
                 <div className="flex items-center space-x-4">
                  <img className="w-10 h-10" src="/user.svg" alt="Users icon" />
                  <p className="text-white">{bets[color as "red" | "green" | "black"].length}</p>
                 </div>
                  <p className="text-gray-500">
                    Total bet: <span className="text-white">{amount}</span>
                  </p>
              </div>


              {/* Render list of users' bets for each color */}
              <div className="bet-list">
                {bets[color as "red" | "green" | "black"].map((bet, idx) => (
                  <div key={idx} className="bet-item">
                    <img src={bet.profileImageUrl} alt={bet.username} width="30" height="30" />
                    <span>{bet.username}</span> <span>{bet.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="refuel-section">
        {(showRefuel && phase === "waiting") && (
          <button className="refuel-btn" onClick={handleRefuel}>
            Refuel Balance
          </button>
        )}
      </div>
        
    </div>
  );
};