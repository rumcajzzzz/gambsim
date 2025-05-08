import { connect } from "@/lib/mongo"; 
import UserStats from "@/lib/models/user.model";
import "@styles/socketclient.css";
import "@styles/leaderboard.css";

export async function getServerSideProps() {
	try {
	  await connect(); 
	  const users = await UserStats.find().lean();
	  const serializedUsers = users.map(user => ({
		...user,
		_id: user._id.toString(),
		timeCreated: user.timeCreated ? user.timeCreated.toISOString() : null,
		timeUpdated: user.timeUpdated ? user.timeUpdated.toISOString() : null, 
	  }));
	
	  return {
		props: {
		  users: serializedUsers,
		},
	  };
	} catch (error) {
	  console.error("Error fetching user data:", error);
	  return {
		props: {
		  users: [],
		},
	  };
	}
  }
	
  export default function LeaderboardPage({ users }) {
	return (
	  <div>
		<h1>Leaderboard</h1>
		<ul>
		  {users.length === 0 ? (
			<li>No users found</li>
		  ) : (
			users.map((user) => (
			  <li key={user._id}>
				<h3>{user.username}</h3>
				<ul>
				  <li>Bets Placed: {user.bets_placed}</li>
				  <li>Bets Won: {user.bets_won}</li>
				  <li>Bets Lost: {user.bets_lost}</li>
				  <li>Total Betted Amount: ${user.total_betted_amount}</li>
				  <li>Total Won: ${user.total_won}</li>
				  <li>Total Lost: ${user.total_lost}</li>
				  <li>Greens Won: {user.greens_won}</li>
				  <li>Current Balance: ${user.current_balance}</li>
				</ul>
			  </li>
			))
		  )}
		</ul>
	  </div>
	);
  }