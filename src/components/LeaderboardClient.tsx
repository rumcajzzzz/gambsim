"use client";

import { useState } from "react";

interface SerializedUser {
  _id: string;
  username: string;
  bets_placed: number;
  bets_won: number;
  bets_lost: number;
  total_betted_amount: number;
  total_won: number;
  total_lost: number;
  greens_won: number;
  current_balance: number;
  timeCreated: string | null;
  timeUpdated: string | null;
  profile_image_url: string | null;
}

const sortOptions = [
  { value: "current_balance", label: "Current Balance" },
  { value: "bets_placed", label: "Bets Placed" },
  { value: "bets_won", label: "Bets Won" },
  { value: "bets_lost", label: "Bets Lost" },
  { value: "total_betted_amount", label: "Total Betted Amount" },
  { value: "total_won", label: "Total Won" },
  { value: "total_lost", label: "Total Lost" },
  { value: "greens_won", label: "Greens Won" },
];

export default function LeaderboardClient({ users }: { users: SerializedUser[] }) {
  const [sortBy, setSortBy] = useState("current_balance");

  const sortedUsers = [...users].sort((a, b) => {
    const valueA = a[sortBy as keyof SerializedUser];
    const valueB = b[sortBy as keyof SerializedUser];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return valueB - valueA;
    }
    return 0; 
  });

  const topUsers = sortedUsers.slice(0, 10);

  return (
    <div className="leaderboard-container">
        <h1 className="leaderboard-header">Leaderboard</h1>
        <label htmlFor="sort" style={{ display: "none" }}>Sort by</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="leaderboard-select"
          >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="select-option">
              {option.label}
            </option>
          ))}
        </select>
        <ul className="leaderboard-component">
          {topUsers.length === 0 ? (
            <li>No users found</li>
          ) : (
            topUsers.map((user, index) => (
              <li
                key={user._id}
                className={`leaderboard-item top-${index + 1}`}
              >
                <span className="leaderboard-rank">{index + 1}</span>
                <img
                  src={user.profile_image_url || "/user.svg"}
                  alt={user.username}
                  className="leaderboard-avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                  }}
                />
                <span className="leaderboard-username">{user.username}</span>
                <span className="leaderboard-score">
                  {user[sortBy as keyof SerializedUser]}
                </span>
              </li>
            ))
          )}
        </ul>
    </div>
  );
}
