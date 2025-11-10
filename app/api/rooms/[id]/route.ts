import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: any, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');
  const { roomNumber, category, type, floor } = await req.json(); 

  console.log(`PATCH /api/rooms/${id} called with userId: ${userId}, userRole: ${userRole}, roomNumber: ${roomNumber}, category: ${category}, type: ${type}, floor: ${floor}`);

  if (!userId || (userRole !== 'ADMIN' && userRole !== 'ROOM_PREPARER')) {
    console.error(`Forbidden access attempt: userId: ${userId}, userRole: ${userRole}`);
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataToUpdate: { roomNumber?: string, category?: any, type?: any, floor?: number } = {};

  if (roomNumber) {
    dataToUpdate.roomNumber = roomNumber;
  }
  if (category) {
    dataToUpdate.category = category;
  }
  if (type) {
    dataToUpdate.type = type;
  }
  if (floor) {
    dataToUpdate.floor = floor;
  }
  console.log(`Data to update for room ${id}:`, dataToUpdate);

  try {
    console.log(`Finding room with id: ${id}`);
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!room) {
      console.error(`Room not found for id: ${id}`);
      return NextResponse.json({ message: 'Kamar tidak ditemukan' }, { status: 404 });
    }
    console.log(`Found room:`, room);

    console.log(`Updating room ${id} with data:`, dataToUpdate);
    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(id, 10) },
      data: dataToUpdate,
    });
    console.log(`Room ${id} updated successfully:`, updatedRoom);

    let activity = '';
    if (roomNumber && roomNumber !== room.roomNumber) {
      activity += `Nomor kamar berubah dari ${room.roomNumber} menjadi ${roomNumber}. `;
    }
    if (category && category !== room.category) {
      activity += `Status berubah dari ${room.category} menjadi ${category}. `;
    }
    if (type && type !== room.type) {
      activity += `Tipe berubah dari ${room.type} menjadi ${type}. `;
    }
    if (floor && floor !== room.floor) {
      activity += `Lantai berubah dari ${room.floor} menjadi ${floor}. `;
    }

    if (activity) {
      console.log(`Logging activity: "${activity}" for userId: ${userId}, roomId: ${id}`);
      await prisma.log.create({
        data: {
          activity,
          userId: parseInt(userId, 10),
          roomId: parseInt(id, 10),
        },
      });
      console.log('Activity logged.');
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error(`Error updating room ${id}:`, error);
    return NextResponse.json(
      { message: 'Gagal memperbarui kamar' },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: any, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const userRole = req.headers.get('x-user-role');
  const userId = req.headers.get('x-user-id');

  console.log(`DELETE /api/rooms/${id} called with userId: ${userId}, userRole: ${userRole}`);

  if (!userId || userRole !== 'ADMIN') {
    console.error(`Forbidden access attempt for DELETE: userId: ${userId}, userRole: ${userRole}`);
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  try {
    console.log(`Finding room with id: ${id} for deletion`);
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!room) {
      console.error(`Room not found for id: ${id} during DELETE`);
      return NextResponse.json({ message: 'Kamar tidak ditemukan' }, { status: 404 });
    }
    console.log(`Found room for deletion:`, room);

    console.log(`Logging deletion activity for room ${room.roomNumber} (id: ${id}) by userId: ${userId}`);
    await prisma.log.create({
      data: {
        activity: `Kamar ${room.roomNumber} dihapus`,
        userId: parseInt(userId, 10),
        roomId: parseInt(id, 10),
      },
    });
    console.log('Deletion activity logged.');

    console.log(`Deleting associated logs for room id: ${id}`);
    await prisma.log.deleteMany({
      where: { roomId: parseInt(id, 10) },
    });
    console.log(`Associated logs deleted for room id: ${id}`);

    console.log(`Deleting room with id: ${id}`);
    await prisma.room.delete({
      where: { id: parseInt(id, 10) },
    });
    console.log(`Room with id: ${id} deleted successfully.`);
    return NextResponse.json({ message: 'Kamar berhasil dihapus' });
  } catch (error) {
    console.error(`Error deleting room ${id}:`, error);
    return NextResponse.json(
      { message: 'Gagal menghapus kamar' },
      { status: 500 }
    );
  }
}