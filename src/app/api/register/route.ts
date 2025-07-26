import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
  }

  if (email === 'admin@admin.com') {
    return NextResponse.json({ message: 'Registration with the admin email is not allowed.' }, { status: 400 });
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      console.log('User already exists:', email);
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Hashed password:', hashedPassword);

    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role: 'user',
        approved: false,
      })
      .returning();

    console.log('New user created:', newUser);

    return NextResponse.json({
      message: 'User created successfully. Please wait for admin approval.',
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};