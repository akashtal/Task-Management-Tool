import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const { userId, approved } = await req.json();

    if (typeof userId !== 'number' || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await db.update(users).set({ approved }).where(eq(users.id, userId));

    return NextResponse.json({ message: `User ${approved ? 'approved' : 'rejected'}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
