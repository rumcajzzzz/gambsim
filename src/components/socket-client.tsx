"use client";

import { SetStateAction, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketClient = () => {
  const [socket, setSocket] = useState(Boolean);
  const [connected, setConnected] = useState(false);
  const [rolledSlot, setRolledSlot] = useState<number | null>(null);

  useEffect(() => {
    console.log("Trying to connect...");
    const socketInstance = io("http://localhost:3000/");

    socketInstance.on("connect", () => {
      setSocket(socketInstance.connected);
      setConnected(true);
      console.log("Connected to the socket");
    });

    socketInstance.on("startRoll", (data: { rolledSlotIndex: SetStateAction<number | null>; }) => {
      console.log("Received roll from server:", data.rolledSlotIndex);
      setRolledSlot(data.rolledSlotIndex);

    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from the socket");
    });

    return () => {
      socketInstance.disconnect();
      console.log("Disconnected from the socket");
    };
  }, []);

  return (
    <div>
      {connected ? (
        <div>Connected! {rolledSlot !== null && <div>Rolling to: {rolledSlot}</div>}</div>
      ) : (
        <div>Connecting...</div>
      )}
    </div>
  );
};