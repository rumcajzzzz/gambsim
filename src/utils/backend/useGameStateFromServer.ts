import { SetStateAction, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export const useGameStateFromServer = () => {
  const [timeLeft, setTimeLeft] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rolledSlot, setRolledSlot] = useState<number | null>(null);

  useEffect(() => {
    socket.on("timeUpdate", (timeLeft: SetStateAction<number>) => {
      setTimeLeft(timeLeft);
    });

    socket.on("startRoll", (rolledSlotIndex: SetStateAction<number | null>) => {
      setRolledSlot(rolledSlotIndex);
      setIsRolling(true);
    });

    socket.on("endRoll", (timeLeft: SetStateAction<number> ) => {
      setIsRolling(false);
      setTimeLeft(timeLeft);
    });

    return () => {
      socket.off("timeUpdate");
      socket.off("startRoll");
      socket.off("endRoll");
    };
  }, []);

  return { timeLeft, isRolling, rolledSlot };
};
