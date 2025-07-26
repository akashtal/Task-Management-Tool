import { db } from '@/lib/drizzle';
import { todos, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET all todos with user email
export async function GET() {
  try {
    const result = await db
      .select({
        id: todos.id,
        title: todos.title,
        description: todos.description,
        completed: todos.completed,
        createdAt: todos.createdAt,
        userEmail: users.email,
      })
      .from(todos)
      .leftJoin(users, eq(todos.userId, users.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
