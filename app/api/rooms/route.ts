import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        roomNumber: 'desc',
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error in GET /api/rooms:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data kamar' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');
  const userId = req.headers.get('x-user-id');

  console.log(`POST /api/rooms called with userId: ${userId}, userRole: ${userRole}`);

  if (!userId || userRole !== 'ADMIN') {
    console.error(`Forbidden access attempt: userId: ${userId}, userRole: ${userRole}`);
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  try {
    const { roomNumber, category, type, floor } = await req.json();
    console.log(`Received roomNumber: ${roomNumber}, category: ${category}, type: ${type}, floor: ${floor}`);

    // Check if room already exists
    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber },
    });

    if (existingRoom) {
      console.warn(`Attempted to create duplicate roomNumber: ${roomNumber}`);
      return NextResponse.json(
        { message: 'Nomor kamar sudah ada' },
        { status: 409 }
      );
    }

    const dataToCreate = {
      roomNumber,
      category,
      type,
      floor,
    };
    console.log('Data for room creation:', dataToCreate);

    console.log('Creating new room in database...');
    const newRoom = await prisma.room.create({
      data: dataToCreate,
    });
    console.log('Room created successfully:', newRoom);

    // Log the room creation activity
    if (userId) {
      await prisma.log.create({
        data: {
          activity: `Kamar ${newRoom.roomNumber} ditambahkan`,
          userId: parseInt(userId, 10),
          roomId: newRoom.id,
        },
      });
      console.log('Room creation activity logged.');
    }

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { message: 'Gagal membuat kamar' },
      { status: 500 }
    );
  }
}
