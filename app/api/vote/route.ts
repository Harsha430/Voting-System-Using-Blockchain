import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Blockchain, Block } from '@/lib/blockchain';

export async function POST(request: Request) {
  try {
    const { voterId, candidateId, uniqueID } = await request.json();

    // 1. Verify Voter
    const voter = await prisma.user.findUnique({
      where: { uniqueID },
    });

    if (!voter) {
      return NextResponse.json({ error: 'Voter not found' }, { status: 404 });
    }

    if (voter.hasVoted) {
      return NextResponse.json(
        { error: 'You have already voted' },
        { status: 400 }
      );
    }

    // 2. Verify Election Status
    const election = await prisma.election.findFirst();
    if (!election || !election.isOpen) {
      return NextResponse.json(
        { error: 'Election is closed' },
        { status: 400 }
      );
    }

    // 3. Create Block
    const blockchain = new Blockchain();
    // Load existing chain from DB to get latest block (simplified)
    const lastBlockDb = await prisma.block.findFirst({
      orderBy: { index: 'desc' },
    });

    let previousHash = '0';
    let index = 0;

    if (lastBlockDb) {
      previousHash = lastBlockDb.hash;
      index = lastBlockDb.index + 1;
    }

    const newBlock = new Block(
      index,
      new Date().toISOString(),
      { voterId: uniqueID, candidateId },
      previousHash
    );

    // Mine the block (proof of work)
    newBlock.mineBlock(blockchain.difficulty);

    // 4. Save Block to DB
    await prisma.block.create({
      data: {
        index: newBlock.index,
        timestamp: newBlock.timestamp,
        data: JSON.stringify(newBlock.data),
        previousHash: newBlock.previousHash,
        hash: newBlock.hash,
        nonce: newBlock.nonce,
      },
    });

    // 5. Update Voter Status
    await prisma.user.update({
      where: { id: voter.id },
      data: { hasVoted: true },
    });

    // 6. Update Candidate Vote Count (Optional optimization)
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { voteCount: { increment: 1 } },
    });

    return NextResponse.json({ message: 'Vote cast successfully', block: newBlock });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
