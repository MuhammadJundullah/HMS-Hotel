import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');

  if (!adminId || userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Email, password, dan role harus disediakan' }, { status: 400 });
    }

    if (role !== 'ROOM_PREPARER') {
      return NextResponse.json({ message: 'Hanya role ROOM_PREPARER yang dapat ditambahkan melalui endpoint ini' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    try {
      await prisma.log.create({
        data: {
          activity: `Menambahkan pengguna baru: ${newUser.email} dengan peran ${newUser.role}`,
          userId: parseInt(adminId, 10),
        },
      });
    } catch (logError) {
      console.error('Error creating log entry for new user:', logError);
      // Do not rethrow, as user creation was successful.
      // The main response should still be successful for the user creation.
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Gagal membuat pengguna' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');

  if (!adminId || userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Terlarang' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Gagal mengambil pengguna' }, { status: 500 });
  }
}

