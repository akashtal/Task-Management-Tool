
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from '@/lib/drizzle';
import { todos } from '@/lib/schema';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await db.insert(todos).values({ 
      title, 
      description: description || '', 
      userId: Number(session.user.id),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({ success: true, todo: result[0] });
  } catch (error) {
    console.error('Create todo error:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
