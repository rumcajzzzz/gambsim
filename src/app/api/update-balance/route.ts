import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateBalance } from "@/utils/updateBalanceANDplaceBet"; 

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amountChange } = await req.json();

  try {
    const updatedBalance = await updateBalance(userId, amountChange);
    return NextResponse.json({ success: true, updatedBalance });
  } catch (err) {
    console.error("Error updating balance:", err);
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 });
  }
}
