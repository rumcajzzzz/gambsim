import { useEffect, useState } from 'react';

export const useGameStateSync = () => {
  const [gameState, setGameState] = useState({
    isRolling: false,
    timeLeft: 6,
    rollHistory: [],
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/game-state');
        const data = await res.json();
        setGameState(data);
      } catch (err) {
        console.error('Failed to fetch game state:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return gameState;
};
