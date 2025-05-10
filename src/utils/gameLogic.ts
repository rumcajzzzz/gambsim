import { useEffect, useRef, useState } from "react";

export const baseColors = [
  "green", "red", "black", "red", "black", "red", "black", "red", "black", 
  "red", "black", "red", "black", "red", "black"
];

export const baseNumbers = Array.from({ length: 15 }, (_, i) => i);
export const slotWidth = 80;
export const visibleSlots = 11;
export const centerSlot = Math.floor(visibleSlots / 2);
export const repeatCount = 15;
export const safeLoopZone = baseNumbers.length * 2;
export const timeRoundLength = 6;
export const betBlockTime = 1;

export const buildSlotArray = () => {
  const result: number[] = [];
  for (let i = 0; i < repeatCount; i++) {
    result.push(...baseNumbers);
  }
  return result;
};

export const useSound = (src: string, volume = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, volume]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; 
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
      });
    }
  };

  return play;
};