"use client";
import { useMemo } from "react";
import { baseColors, buildSlotArray } from "@/utils/gameLogic";

export default function SlotBar({ offset }: { offset: number }) {
  const slots = useMemo(() => buildSlotArray(), []);

  return (
    <div className="flex justify-center">
      <div className="slotbar-container w-[880px] overflow-hidden rounded-xl shadow-2xl">
        <div
          className="flex w-max transition-transform"
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
