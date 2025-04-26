import GameState from './models/gamestate.model';
import { connect } from './mongo';

let isLoopRunning = false;

export const startGameLoop = async () => {
  if (isLoopRunning) return;
  isLoopRunning = true;

  await connect();

  let timeLeft = 6;
  let isRolling = false;
  let rollHistory: number[] = [];

  setInterval(async () => {
    try {
      if (timeLeft > 0 && !isRolling) {
        timeLeft -= 1;
      } else if (timeLeft <= 0 && !isRolling) {
        isRolling = true;
        const newRoll = Math.floor(Math.random() * 15);
        rollHistory = [newRoll, ...rollHistory.slice(0, 9)];

        setTimeout(() => {
          isRolling = false;
          timeLeft = 6;
        }, 7000);
      }

      await GameState.findOneAndUpdate(
        {},
        {
          isRolling,
          timeLeft,
          rollHistory,
        },
        { upsert: true }
      );
    } catch (err) {
      console.error('Game loop error:', err);
    }
  }, 1000);
};
