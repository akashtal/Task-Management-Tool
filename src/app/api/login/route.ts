// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/login
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Access denied' }, { status: 403 });
  }

  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      approved: users.approved,
      createdAt: users.createdAt,
    }).from(users);

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Access denied' }, { status: 403 });
  }

  const body = await req.json();
  const { userId, approved } = body;

  try {
    await db.update(users).set({ approved }).where(eq(users.id, userId));
    return NextResponse.json({ message: 'User approval status updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
