import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const roomPreparerPassword = await bcrypt.hash('preparer123', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
      {
        email: 'roompreparer@example.com',
        password: roomPreparerPassword,
        role: 'ROOM_PREPARER',
      },
    ],
  });

  await prisma.room.createMany({
    data: [
      { roomNumber: '101', status: 'TERSEDIA' },
      { roomNumber: '102', status: 'DIPESAN' },
      { roomNumber: '103', status: 'TERSEDIA' },
      { roomNumber: '104', status: 'DIBERSIHKAN' },
      { roomNumber: '105', status: 'TERSEDIA' },
      { roomNumber: '106', status: 'DIPESAN' },
      { roomNumber: '107', status: 'TERSEDIA' },
      { roomNumber: '108', status: 'DIBERSIHKAN' },
      { roomNumber: '109', status: 'TERSEDIA' },
      { roomNumber: '110', status: 'DIPESAN' },
      { roomNumber: '201', status: 'TERSEDIA' },
      { roomNumber: '202', status: 'DIPESAN' },
      { roomNumber: '203', status: 'TERSEDIA' },
      { roomNumber: '204', status: 'DIBERSIHKAN' },
      { roomNumber: '205', status: 'TERSEDIA' },
      { roomNumber: '206', status: 'DIPESAN' },
      { roomNumber: '207', status: 'TERSEDIA' },
      { roomNumber: '208', status: 'DIBERSIHKAN' },
      { roomNumber: '209', status: 'TERSEDIA' },
      { roomNumber: '210', status: 'DIPESAN' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });