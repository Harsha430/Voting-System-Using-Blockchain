import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing database connection...');
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to the database!');
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database.`);
  } catch (e) {
    console.error('❌ Connection failed!');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
