import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Connectivity Test ---');
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connection successful!');

    console.log('Querying users count...');
    const count = await prisma.user.count();
    console.log(`✅ Query successful! Total users: ${count}`);

    if (count === 0) {
      console.log('⚠️ Warning: No users found. You might need to seed the database.');
    }
  } catch (error: any) {
    console.error('❌ Connection failed!');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
