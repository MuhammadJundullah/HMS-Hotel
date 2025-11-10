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
      { roomNumber: '101', category: 'KOSONG', type: 'STANDARD', floor: 1 },
      { roomNumber: '102', category: 'TERISI', type: 'DELUXE', floor: 1 },
      { roomNumber: '103', category: 'KOSONG', type: 'SUPERIOR', floor: 1 },
      { roomNumber: '104', category: 'DIBERSIHKAN', type: 'STANDARD', floor: 1 },
      { roomNumber: '105', category: 'KOSONG', type: 'EXECUTIVE', floor: 1 },
      { roomNumber: '106', category: 'TERISI', type: 'FAMILY', floor: 1 },
      { roomNumber: '107', category: 'KOSONG', type: 'STANDARD', floor: 1 },
      { roomNumber: '108', category: 'DIBERSIHKAN', type: 'DELUXE', floor: 1 },
      { roomNumber: '109', category: 'KOSONG', type: 'SUPERIOR', floor: 1 },
      { roomNumber: '110', category: 'TERISI', type: 'STANDARD', floor: 1 },
      { roomNumber: '201', category: 'KOSONG', type: 'EXECUTIVE', floor: 2 },
      { roomNumber: '202', category: 'TERISI', type: 'FAMILY', floor: 2 },
      { roomNumber: '203', category: 'KOSONG', type: 'STANDARD', floor: 2 },
      { roomNumber: '204', category: 'DIBERSIHKAN', type: 'DELUXE', floor: 2 },
      { roomNumber: '205', category: 'KOSONG', type: 'SUPERIOR', floor: 2 },
      { roomNumber: '206', category: 'TERISI', type: 'STANDARD', floor: 2 },
      { roomNumber: '207', category: 'KOSONG', type: 'EXECUTIVE', floor: 2 },
      { roomNumber: '208', category: 'DIBERSIHKAN', type: 'FAMILY', floor: 2 },
      { roomNumber: '209', category: 'KOSONG', type: 'STANDARD', floor: 2 },
      { roomNumber: '210', category: 'TERISI', type: 'DELUXE', floor: 2 },
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