"use client";
import { SocketClient } from "@/components/socketClient";

export default function Home() {

return (
    <main className="flex justify-center bg-gray-100">
      <SocketClient />
    </main>
  );
}