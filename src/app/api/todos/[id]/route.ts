import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateTodoStatus, deleteTodo } from "@/lib/actions";
import { db } from '@/lib/drizzle';
import { todos } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    await updateTodoStatus(Number(id), body.completed ?? true);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update todo error:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await db.update(todos)
      .set({ 
        title, 
        description: description || '', 
        updatedAt: new Date() 
      })
      .where(
        and(
          eq(todos.id, Number(id)),
          eq(todos.userId, Number(session.user.id))
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Edit todo error:', error);
    return NextResponse.json({ error: 'Failed to edit todo' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteTodo(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete todo error:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
} 