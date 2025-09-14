"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { baseColors, buildSlotArray } from "@/utils/gameLogic";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // upewnij się, że to jest Twój backend

export default function SlotBar() {
  const slots = useMemo(() => buildSlotArray(), []);
  const [offset, setOffset] = useState(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    socket.on("rollStart", ({ rolledIndex, duration }: { rolledIndex: number; duration: number }) => {
      const slotWidth = 80; // szerokość jednego slotu
      const visibleSlots = Math.floor(880 / slotWidth); // szerokość kontenera / szerokość slota
      const centerOffset = Math.floor(visibleSlots / 2);

      // ile pikseli trzeba przesunąć, aby wylosowany slot wylądował na środku
      const targetOffset =
        slotWidth * (slots.length * 3 + rolledIndex - centerOffset);

      const start = performance.now();

      const animate = (time: number) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);

        // easing-out (szybki start, zwalnia przy końcu)
        const ease = 1 - Math.pow(1 - progress, 3);

        setOffset(targetOffset * ease);

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        }
      };

      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(animate);
    });

    return () => {
      socket.off("rollStart");
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [slots]);

  return (
    <div className="flex justify-center">
      <div className="slotbar-container w-[880px] overflow-hidden rounded-xl shadow-2xl">
        <div
          className="flex w-max"
          style={{ transform: `translateX(${-offset}px)` }}
        >
          {slots.map((num, i) => {
            const color = baseColors[num % 15];
            return (
              <div
                key={i}
                className={`w-20 h-20 flex items-center justify-center text-white font-bold text-xl ${
                  color === "green"
                    ? "bg-green-600"
                    : color === "red"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
