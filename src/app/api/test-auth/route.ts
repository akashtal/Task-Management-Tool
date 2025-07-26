import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  console.log('Test auth - Session:', session);
  console.log('Test auth - User ID:', session?.user?.id);
  console.log('Test auth - User email:', session?.user?.email);
  
  if (!session?.user?.id) {
    return NextResponse.json({ 
      error: "Unauthorized", 
      session: session,
      hasUser: !!session?.user,
      userId: session?.user?.id 
    }, { status: 401 });
  }
  
  return NextResponse.json({ 
    success: true, 
    user: {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      approved: session.user.approved
    }
  });
} 