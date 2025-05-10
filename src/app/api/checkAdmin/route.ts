import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS!.split(',');
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (userId && ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ isAdmin: true });
  }
  return NextResponse.json({ isAdmin: false }, { status: 403 });
}
