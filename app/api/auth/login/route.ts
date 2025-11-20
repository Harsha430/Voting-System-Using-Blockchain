import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import SHA256 from 'crypto-js/sha256';

export async function POST(request: Request) {
  try {
    const { uniqueID, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { uniqueID },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const hashedPassword = SHA256(password).toString();

    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In a real app, we would set a session cookie here.
    // For simplicity, we'll return the user data and handle state on client.
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        uniqueID: user.uniqueID,
        role: user.role,
        hasVoted: user.hasVoted,
      },
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
