// src/app/api/admin/user-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: NextRequest) {
  try {
    const { userId, status } = await req.json();

    if (!userId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    await db
      .update(users)
      .set({ approved: status === 'approved' }) // ✅ use approved field
      .where(eq(users.id, userId));

    return NextResponse.json({ message: 'User status updated' });
  } catch (err) {
    console.error('Error updating user status:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
