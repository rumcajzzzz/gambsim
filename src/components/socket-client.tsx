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
  const [betAmount, setBetAmount] = useState(10);
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

  const { user } = useUser();

  useEffect(() => {
    const socketInstance = io("http://localhost:3001/");
    
    socketInstance.on("connect", () => {
      setConnected(true);
      if (user?.id) socketInstance.emit("userClerkId", user.id);
    });
    setSocket(socketInstance);

    socketInstance.emit("userClerkData", {
       userId: user?.id,
       username: user?.username,
       email: user?.emailAddresses?.[0]?.emailAddress,
       first_name: user?.firstName,
       last_name: user?.lastName,
       profile_image_url: user?.imageUrl,
    });

    socketInstance.on("initialState", (data: any) => {
      setBalance(data.points);
      setRollHistory(data.rollHistory);
      setPhase(data.status);
      setCountdown(data.timeLeft);
      setCurrentBets(data.globalBets);
    });

    socketInstance.on("betsUpdated", (bets: { red: number; green: number; black: number }) => {
      setCurrentBets(bets);
    });

    socketInstance.on("balanceUpdated", (newBalance: number) => {
      setBalance(newBalance);
    });

    socketInstance.on("newRoll", (roll: number[]) => {
      setRoll(roll[0]);
      setRollHistory(roll);
    });

    socketInstance.on("status", (status: "waiting" | "rolling") => {
      setPhase(status);

      if (status === "waiting") {
        setCurrentBets({ red: 0, green: 0, black: 0 }); 
        setCountdown(10);
      }
      else if (status === "rolling") {
        setCountdown(null);
        }
    });

    socketInstance.on("userBets", (user: UserBets) => {
      setLocalUser(user);
    });

    socketInstance.on("showRefuel", (show: boolean) => {
      setShowRefuel(show);
    })

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

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
    socket?.emit("placeBet", { color, amount: betAmount,  username: user?.username || user?.firstName || "Anonymous",
      avatar: user?.imageUrl || null, });
  };

  const handleRefuel = () => {
    socket?.emit("refuel", false);
  };

  return (
    <div className="socket-client-container">
      <div className="status-bar">
        {connected ? (
          <div className="status connected">Connected</div>
        ) : (
          <div className="status connecting">Connecting...</div>
        )}
      </div>

      <div className="phase-info my-4">
        {/* <h4>Game Status:</h4> */}
        {phase === "waiting" && countdown !== null ? (
          <p>Rolling in: {countdown}s</p>
        ) : phase === "rolling" ? (
          <p>Rolling...</p>
        ) : (
          <p>Result shown!</p>
        )}
      </div>

      <div className="game-info">
        <h2>Balance: {balance}</h2>
        {/* <h3>Last Roll: {rollHistory[0]}</h3> */}
      </div>

      

      <div className="roll-history">
        <h4>Last 10 Rolls: </h4>
        <ul className="flex mx-50">
          {Array.isArray(rollHistory) && rollHistory.map((num, idx) => (
            <li key={idx}>{num}</li>
          ))}
        </ul>
      </div>

      <div className="bet-columns">
          {[...Object.entries(currentBets)]
            .map(([color, amount]) => (
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
                <p className="global-bet">TOTAL: {amount}</p>
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