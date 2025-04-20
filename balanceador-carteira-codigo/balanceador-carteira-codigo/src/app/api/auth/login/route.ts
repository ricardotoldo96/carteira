import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const result = await authenticate(formData);
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  
  return NextResponse.json({ success: true });
}
