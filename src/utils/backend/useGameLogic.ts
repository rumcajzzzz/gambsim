"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useGameLogic = (userId: string) => {
  const { data: gameState, mutate } = useSWR('/api/game-state', fetcher, {
    refreshInterval: 1000
  });

  const [localState, setLocalState] = useState({
    betAmount: 0,
    showRefuel: false,
    betColor: null as "red" | "green" | "black" | null,
  });
  

  const placeBet = async (color: string) => {
    if (!gameState || gameState.isRolling) return;
    
    await fetch('/api/game-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: "place-bet",
        color,
        amount: localState.betAmount
      })
    });
    
    await fetch('/api/user-stats', {
      method: 'POST',
      body: JSON.stringify({ amount: -localState.betAmount })
    });
    
    mutate();
  };

  const startRoll = async () => {
    await fetch('/api/game-state', {
      method: 'POST',
      body: JSON.stringify({ action: "start-roll" })
    });
    mutate();
  };

  const resolveRoll = async () => {
    await fetch('/api/game-state', {
      method: 'POST',
      body: JSON.stringify({ action: "resolve-roll" })
    });
    mutate();
  };

  return {
    gameState,
    localState,
    setLocalState,
    placeBet,
    startRoll,
    resolveRoll
  };
};