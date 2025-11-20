import { PrismaClient } from '@prisma/client';
import SHA256 from 'crypto-js/sha256';

const prisma = new PrismaClient();

async function verifyChain() {
  console.log('Verifying blockchain integrity...');
  const chain = await prisma.block.findMany({
    orderBy: { index: 'asc' },
  });

  if (chain.length === 0) {
    console.log('Blockchain is empty.');
    return;
  }

  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    // 1. Check hash integrity
    const calculatedHash = SHA256(
      currentBlock.index +
        currentBlock.previousHash +
        currentBlock.timestamp +
        currentBlock.data +
        currentBlock.nonce
    ).toString();

    if (currentBlock.hash !== calculatedHash) {
      console.error(`❌ Invalid hash at block ${currentBlock.index}`);
      console.error(`   Stored: ${currentBlock.hash}`);
      console.error(`   Calculated: ${calculatedHash}`);
      return;
    }

    // 2. Check link integrity
    if (currentBlock.previousHash !== previousBlock.hash) {
      console.error(`❌ Broken link at block ${currentBlock.index}`);
      console.error(`   Previous Hash: ${currentBlock.previousHash}`);
      console.error(`   Actual Previous Hash: ${previousBlock.hash}`);
      return;
    }
  }

  console.log('✅ Blockchain is valid!');
}

verifyChain()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
