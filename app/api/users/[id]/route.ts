import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: any, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const userRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');

  if (!adminId || userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  try {
    const { email, password, role } = await req.json();
    const dataToUpdate: { email?: string; password?: string; role?: string } = {};

    if (email) {
      dataToUpdate.email = email;
    }
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    if (role) {
      // Only allow changing role to ROOM_PREPARER or ADMIN
      if (role !== 'ROOM_PREPARER' && role !== 'ADMIN') {
        return NextResponse.json({ message: 'Peran tidak valid' }, { status: 400 });
      }
      dataToUpdate.role = role;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: 'Tidak ada data yang disediakan untuk diperbarui' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: dataToUpdate as any,
    });

    try {
      await prisma.log.create({
        data: {
          activity: `Memperbarui pengguna: ${updatedUser.email} (ID: ${updatedUser.id})`,
          userId: parseInt(adminId, 10),
        },
      });
    } catch (logError) {
      console.error('Error creating log entry for user update:', logError);
      // Do not rethrow, as user update was successful.
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return NextResponse.json({ message: 'Gagal memperbarui pengguna' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: any, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const userRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');

  if (!adminId || userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return NextResponse.json({ message: 'Gagal mengambil pengguna' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: any, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const userRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');

  if (!adminId || userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!userToDelete) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (userToDelete.id === parseInt(adminId, 10)) {
      return NextResponse.json({ message: 'Tidak dapat menghapus akun Anda sendiri' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });

    try {
      await prisma.log.create({
        data: {
          activity: `Menghapus pengguna: ${userToDelete.email} (ID: ${userToDelete.id})`,
          userId: parseInt(adminId, 10),
        },
      });
    } catch (logError) {
      console.error('Error creating log entry for user deletion:', logError);
      // Do not rethrow, as user deletion was successful.
    }

    return NextResponse.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return NextResponse.json({ message: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}
