import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// GET all users
export async function GET() {
  const result = await db.select().from(users);
  return NextResponse.json(result);
}

// PATCH to approve/reject a user
export async function PATCH(req: NextRequest) {
  const { userId, status } = await req.json();

  if (!userId || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    await db
      .update(users)
      .set({ approved: status === 'approved' })
      .where(eq(users.id, Number(userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
