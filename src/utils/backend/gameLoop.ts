import { connect } from "@/lib/mongo";
import GameState from "@/lib/models/gamestate.model";

let isRunning = false;

export const startGameLoop = async () => {
  if (isRunning) return;

  isRunning = true;
  await connect();

  let timeLeft = 15;

  setInterval(async () => {
    try {
      if (timeLeft <= 0) {
        const rolledSlot = Math.floor(Math.random() * 15); 

        await GameState.findOneAndUpdate(
          {},
          {
            isRolling: true,
            timeLeft: 15,
            $push: { rollHistory: { $each: [rolledSlot], $slice: -10 } },
          },
          { upsert: true }
        );

        timeLeft = 15;
      } else {
        timeLeft--;

        await GameState.findOneAndUpdate(
          {},
          {
            isRolling: false,
            timeLeft,
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error("Game loop error:", err);
    }
  }, 1000);
};
