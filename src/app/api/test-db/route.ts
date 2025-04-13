import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongo';

export async function GET() {
  try {
    const conn = await connect();
    return NextResponse.json({ connected: !!conn?.connection?.readyState });
  } catch (err) {
    console.error('DB connect error:', err);
    return NextResponse.json({ error: 'Failed to connect' }, { status: 500 });
  }
}
