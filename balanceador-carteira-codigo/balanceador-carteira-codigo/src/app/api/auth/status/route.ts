import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const userId = await getUserId();
  
  if (!userId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  return NextResponse.json({ authenticated: true });
}
