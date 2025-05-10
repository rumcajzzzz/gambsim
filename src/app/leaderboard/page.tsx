import { connect } from "@/lib/mongo";
import UserStats from "@/lib/models/user.model";
import "@styles/socketclient.css";
import "@styles/leaderboard.css";
import LeaderboardClient from "@/components/LeaderboardClient";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function LeaderboardPage() {
  await connect();
  const users = await UserStats.find().lean();

  const serializedUsers = users.map((user: any) => ({
    _id: user._id.toString(),
    username: user.username,
    bets_placed: user.bets_placed,
    bets_won: user.bets_won,
    bets_lost: user.bets_lost,
    total_betted_amount: user.total_betted_amount,
    total_won: user.total_won,
    total_lost: user.total_lost,
    greens_won: user.greens_won,
    current_balance: user.current_balance,
    timeCreated: user.timeCreated ? user.timeCreated.toISOString() : null,
    timeUpdated: user.timeUpdated ? user.timeUpdated.toISOString() : null,
    profile_image_url: user.profile_image_url ?? null,
  }));

  return <LeaderboardClient users={serializedUsers} />;
}
