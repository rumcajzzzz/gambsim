import { connect } from '@/lib/mongo';
import UserStats from '@/lib/models/user.model';
import { notFound } from 'next/navigation';
import '@styles/socketclient.css';
import '@styles/profile.css';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [];
}

const ProfilePage = async ({ params }: { params: { username: string } }) => {
  const { username } = params;

  if (!username) notFound();

  await connect();

  const userMongo = await UserStats.findOne({ username });

  if (!userMongo) notFound();

  const createdAt = new Date(userMongo.timeCreated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userMongo.profile_image_url}
          alt="User profile"
          className="profile-image"
        />
        <h1 className="username">{userMongo.username}</h1>
        <p className="account-created">Account Created: {createdAt}</p>
      </div>

      <div className="stats-container">
        <h2 className="stats-header">Statistics</h2>
        <div className="stat-grid">
          <div className="stat-card balance-card">
            <span className="stat-label">💰 Current Balance:</span>
            <span className="stat-value">{userMongo.current_balance}</span>
          </div>

          <div className="stat-card bets-placed-card">
            <span className="stat-label">🎲 Bets Placed:</span>
            <span className="stat-value">{userMongo.bets_placed}</span>
          </div>

          <div className="stat-card bets-won-card">
            <span className="stat-label">🏆 Bets Won:</span>
            <span className="stat-value">{userMongo.bets_won}</span>
          </div>

          <div className="stat-card bets-lost-card">
            <span className="stat-label">❌ Bets Lost:</span>
            <span className="stat-value">{userMongo.bets_lost}</span>
          </div>

          <div className="stat-card total-betted-card">
            <span className="stat-label">📈 Total Betted Amount:</span>
            <span className="stat-value">{userMongo.total_betted_amount}</span>
          </div>

          <div className="stat-card total-won-card">
            <span className="stat-label">💵 Total Won:</span>
            <span className="stat-value">{userMongo.total_won}</span>
          </div>

          <div className="stat-card total-lost-card">
            <span className="stat-label">📉 Total Lost:</span>
            <span className="stat-value">{userMongo.total_lost}</span>
          </div>

          <div className="stat-card greens-won-card">
            <span className="stat-label">🟢 Greens Won:</span>
            <span className="stat-value">{userMongo.greens_won}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;