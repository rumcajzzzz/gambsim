import { useRef, useState, useEffect } from "react";

export const useSlotAudio = () => {
  const slotRollAudioRef = useRef<HTMLAudioElement | null>(null);
  const slotLandAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const playSound = (type: "roll" | "land") => {
    if (!audioUnlocked) return;
    const audioRef = type === "roll" ? slotRollAudioRef.current : slotLandAudioRef.current;
    if (audioRef) {
      audioRef.currentTime = 0;
      audioRef.play().catch(() => {});
    }
  };

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioUnlocked) {
        slotRollAudioRef.current = new Audio("./assets/mp3/slotroll.mp3");
        slotLandAudioRef.current = new Audio("./assets/mp3/slotland.mp3");
        slotRollAudioRef.current.muted = true;

        slotRollAudioRef.current.play().then(() => {
          setTimeout(() => {
            if (slotRollAudioRef.current) slotRollAudioRef.current.muted = false;
            setAudioUnlocked(true);
          }, 2000);
        }).catch(() => {
          setAudioUnlocked(true);
        });

        window.removeEventListener("click", unlockAudio);
      }
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, [audioUnlocked]);

  return { playSound };
};
