'use client';
import "@styles/socketclient.css"
import "@styles/admin.css"
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from "socket.io-client";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [rolling, setRolling] = useState<boolean | null>(true);
  const [gameloop, setGameloop] = useState<boolean>(true); 
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push('/');
        return;
      }

      const checkIfAdmin = async () => {
        const response = await fetch('/api/checkAdmin');
        const data = await response.json();

        if (data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push('/');
        }
      };

      checkIfAdmin();
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
	if (isAdmin) {
	  const socketInstance = io("http://localhost:3001");
	  setSocket(socketInstance);
  
	  socketInstance.on("connect", () => {
		socketInstance.emit("requestCurrentState");
	  });
  
	  socketInstance.on("currentState", (state: { rolling: boolean, gameloop: boolean }) => {
		setRolling(state.rolling);
		setGameloop(state.gameloop);
	  });
  
	  return () => {
		socketInstance.disconnect();
	  };
	}
  }, [isAdmin]);
  

  const switchRollingBooleanTRUE = () => {
    if (socket && isAdmin) {
	  setRolling(true);
      socket.emit("switchRollingBooleanSTATE", true);
    }
  };

  const switchRollingBooleanFALSE = () => {
    if (socket && isAdmin) {
	  setGameloop(false) 
	  setRolling(false);
      socket.emit("switchRollingBooleanSTATE", false);
    }
  };

  const runRollingCycle = () => {
	if (rolling) {
		if (socket && isAdmin) {
			setGameloop(true);
			socket.emit("runRollingCycle");
		  }
	}
  };

  if (isAdmin === null) return <div></div>;
  if (!isAdmin) return null;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>
      <p className="status-text">
		Rolling status: {rolling === null ? "unknown" : rolling ? "True" : "False"}
	  </p>
	  <p className="status-text">
	  	Gameloop status: {gameloop ? "True" : "False"}
	  </p>


      <div className="button-group">
        <button className="admin-btn green" onClick={switchRollingBooleanTRUE}>Set Rolling: TRUE</button>
        <button className="admin-btn red" onClick={switchRollingBooleanFALSE}>Set Rolling: FALSE</button>
        <button className="admin-btn green" onClick={runRollingCycle}>Start game loop</button>
      </div>
    </div>
  );
}
