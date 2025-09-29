"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

const SLOT_WIDTH = 80;
const baseColors = [
  "green", "red", "black", "red", "black",
  "red", "black", "red", "black", "red",
  "black", "red", "black", "red", "black"
];

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [slotOffset, setSlotOffset] = useState(0);

  const animateSlider = (startOffset: number, totalSlots: number, duration: number) => {
    startTimeRef.current = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      const currentOffset = startOffset + eased * totalSlots;
      setSlotOffset(currentOffset);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        animationRef.current = null;
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const handleRollStart = (data: any) => {
      const { startOffsetSlots, totalSlots, duration } = data;
      animateSlider(startOffsetSlots, totalSlots, duration);
    };

    socket.on("rollStart", handleRollStart);
    return () => {
      socket.off("rollStart", handleRollStart);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (!sliderRef.current) return;
    const totalSlots = baseColors.length;
    const offsetSlots = (slotOffset) % totalSlots;
    sliderRef.current.style.transform = `translateX(-${offsetSlots * SLOT_WIDTH + 8 * SLOT_WIDTH}px)`;
  }, [slotOffset]);

  const renderSlot = (i: number) => {
    const color = baseColors[i % baseColors.length];
    return (
      <div
        key={i}
        className="w-20 h-24 flex items-center justify-center font-bold text-white"
        style={{
          backgroundColor:
            color === "red" ? "#dc2626" :
            color === "black" ? "#111827" :
            "#16a34a",
        }}
      >
        {i % baseColors.length}
      </div>
    );
  };

  return (
		<div
			className="relative m-auto overflow-hidden h-24 rounded-xl bg-gray-800"
			style={{ width: `${SLOT_WIDTH * 15}px` }}
			>
			<div
				className="flex absolute top-0 left-0 h-24 transition-none"
				ref={sliderRef}
			>
				{Array.from({ length: baseColors.length * 4 }).map((_, i) => renderSlot(i))}
			</div>

		{/* Marker */}
			<div className="flex w-full h-full justify-center"><div className="bg-yellow-400 w-1 z-999" /></div>
		</div>
  );
}
