import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import SHA256 from 'crypto-js/sha256';

export async function POST(request: Request) {
  try {
    const { uniqueID, password, role } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { uniqueID },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = SHA256(password).toString();

    const user = await prisma.user.create({
      data: {
        uniqueID,
        password: hashedPassword,
        role: role || 'VOTER',
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: { id: user.id, uniqueID: user.uniqueID, role: user.role },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
