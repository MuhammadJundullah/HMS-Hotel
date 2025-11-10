import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [logs, totalCount] = await prisma.$transaction([
      prisma.log.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        skip: skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
            },
          },
          room: {
            select: {
              roomNumber: true,
            },
          },
        },
      }),
      prisma.log.count(),
    ]);

    return NextResponse.json({ logs, totalCount });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { message: 'Error fetching logs' },
      { status: 500 }
    );
  }
}
