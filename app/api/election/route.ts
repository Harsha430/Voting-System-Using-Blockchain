import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    let election = await prisma.election.findFirst();

    if (!election) {
      election = await prisma.election.create({
        data: { isOpen: true },
      });
    }

    return NextResponse.json(election);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { isOpen } = await request.json();
    let election = await prisma.election.findFirst();

    if (election) {
      election = await prisma.election.update({
        where: { id: election.id },
        data: { isOpen },
      });
    } else {
      election = await prisma.election.create({
        data: { isOpen },
      });
    }

    return NextResponse.json(election);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
