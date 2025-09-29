"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [slotOffset, setSlotOffset] = useState(0);
  const SLOT_WIDTH = 80;
  const baseColors = ["green", "red", "black", "red", "black"];

  useEffect(() => {
    const handleSlotOffset = (px: number) => {
      setSlotOffset(px);
      if (sliderRef.current) {
        const totalWidth = baseColors.length * SLOT_WIDTH;
        sliderRef.current.style.transform = `translateX(-${px % totalWidth}px)`;
      }
    };

    socket.on("slotOffset", handleSlotOffset);

    return () => {
      socket.off("slotOffset", handleSlotOffset);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-800 h-24 rounded-xl">
      <div
        ref={sliderRef}
        className="flex absolute top-0 left-0 h-24 transition-none"
      >
        {Array.from({ length: 50 }).map((_, i) => {
          const color = baseColors[i % baseColors.length];
          return (
            <div
              key={i}
              className={`w-20 h-24 flex items-center justify-center text-white font-bold ${
                color === "red" ? "bg-red-600" : color === "black" ? "bg-black" : "bg-green-600"
              }`}
            >
              {color}
            </div>
          );
        })}
      </div>
      <div className="absolute inset-y-0 left-1/2 w-1 bg-yellow-400 z-10" />
    </div>
  );
}
