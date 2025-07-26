import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserTodos } from "@/lib/actions";
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const todos = await getUserTodos(Number(session.user.id));
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}