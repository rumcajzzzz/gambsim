"use client";
import { useAuth } from "@clerk/nextjs";

export default function Home() {

  const userId = useAuth().userId ?? "guest";

  // const slots = buildSlotArray();
  // const controls = useAnimation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        
    </main>
  );
}