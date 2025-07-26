import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';

export async function GET() {
  try {
    // Test database connection
    const result = await db.select().from(users).limit(1);
    console.log('Database test - Users count:', result.length);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      usersCount: result.length
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 