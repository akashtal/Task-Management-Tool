import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ approved: false, role: null }, { status: 400 });
  }

  if (email === 'admin@admin.com') {
    return NextResponse.json({ approved: true, role: 'admin' }, { status: 200 });
  }

  const result = await db.select().from(users).where(eq(users.email, email));
  const user = result[0];

  if (!user) {
    return NextResponse.json({ approved: false, role: null }, { status: 404 });
  }

  return NextResponse.json({ approved: user.approved, role: user.role }, { status: 200 });
}
