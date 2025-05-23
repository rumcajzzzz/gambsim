import { auth } from '@clerk/nextjs/server';
import { connect } from '@/lib/mongo';
import UserStats from '@lib/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connect();

    const user = await (await clerkClient()).users.getUser(userId);

    
    if (!user) {
      return NextResponse.json({ error: 'User data not found in Clerk' }, { status: 404 });
    }

    const updatedUserData = {
      user_id: userId,
      username: user.username || '',
      email: user.emailAddresses?.[0]?.emailAddress || '',
      first_name: user.firstName || '',
      last_name: user.lastName || '',   
      profile_image_url: user.imageUrl || '', 
    };

    let stats = await UserStats.findOne({ user_id: userId });

    if (!stats) {
      stats = await UserStats.create({
        ...updatedUserData,
        bets_placed: 0,
        bets_won: 0,
        bets_lost: 0,
        total_betted_amount: 0,
        total_won: 0,
        total_lost: 0,
        greens_won: 0,
        current_balance: 0,
      });
      // console.log("User stats created:", stats);
    } else {
      let updated = false;
      // console.log("Comparing user data with existing stats:");
      for (const [key, value] of Object.entries(updatedUserData)) {
        // console.log(`Comparing ${key}: Stored = ${stats[key]}, Incoming = ${value}`);
        if (stats[key] !== value) {
          stats[key] = value;
          updated = true;
        }
      }

      if (updated) {
        // console.log("Data updated, saving...");
        await stats.save();
        // console.log("Stats saved:", stats);
      }  // } else console.log("No changes detected, no update needed.")
    }

    return NextResponse.json(stats);
  } catch (err) {
    // console.error('Error in user-stats GET:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { amountChange, setBalance } = await req.json();

    await connect();

    const userStats = await UserStats.findOne({ user_id: userId });

    if (!userStats) {
      return NextResponse.json({ error: 'User stats not found' }, { status: 404 });
    }

    if (typeof amountChange === 'number') {
      userStats.current_balance += amountChange;  // Add or subtract balance based on bet outcome
    } else if (typeof setBalance === 'number') {
      userStats.current_balance = setBalance;  // Set the balance (e.g., for refueling)
    }

    // Ensure balance doesn't go negative
    userStats.current_balance = Math.max(userStats.current_balance, 0);

    await userStats.save();
    return NextResponse.json(userStats);
  } catch (err) {
    // console.error('Error updating stats:', err);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}

