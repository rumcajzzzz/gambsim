import { useState, useEffect } from "react";

export const useUserBalance = () => {
  const [fetchPoints, setPoints] = useState<number>(0);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const res = await fetch('/api/user-stats');
        if (res.ok) {
          const data = await res.json();
          setPoints(data.current_balance);
        } else {
          console.error('Failed to fetch user stats');
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    };

    fetchUserBalance();
  }, []);

  return fetchPoints;
};