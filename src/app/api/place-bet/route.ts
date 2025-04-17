import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGODB_URI || "sdsd");

// API to handle bet placement
export async function POST(req: Request) {
  const { userId, betAmount, color } = await req.json();

  try {
    await client.connect();
    const db = client.db("yourDatabaseName");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = user.balance;

    if (betAmount <= 0 || betAmount > currentBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const updatedBalance = currentBalance - betAmount;

    // Update balance in the DB
    await usersCollection.updateOne({ userId }, { $set: { balance: updatedBalance } });

    return NextResponse.json({ success: true, updatedBalance });
  } catch (err) {
    console.error("Error placing bet:", err);
    return NextResponse.json({ error: "Failed to place bet" }, { status: 500 });
  } finally {
    await client.close();
  }
}
