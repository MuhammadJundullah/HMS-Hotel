"use client";

import { useEffect, useState } from 'react';
import RoomCard from './components/RoomCard';
import AddRoomForm from './components/AddRoomForm';
import { Room } from '@/types/room';
import { UserRole } from '@/types/user'

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const roomsRes = await fetch('/api/rooms');
      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        const sortedData = roomsData.sort((a: Room, b: Room) => {
          const numA = parseInt(a.roomNumber.replace(/[^0-9]/g, ''), 10);
          const numB = parseInt(b.roomNumber.replace(/[^0-9]/g, ''), 10);
          return numA - numB;
        });
        setRooms(sortedData);
      }

      const userRes = await fetch('/api/auth/user');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUserRole(userData.role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoom = async (roomNumber: string) => {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomNumber }),
    });

    if (res.ok) {
      fetchData();
    } else if (res.status === 409) {
      const errorData = await res.json();
      alert(errorData.message);
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Gagal menambahkan kamar');
    }
  };

  const handleDeleteRoom = async (id: number) => {
    const res = await fetch(`/api/rooms/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 px-2">
          {userRole === 'ADMIN' && <AddRoomForm onAddRoom={handleAddRoom} />}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">Loading rooms...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  userRole={userRole as UserRole}
                  onDelete={handleDeleteRoom}
                  onUpdate={fetchData}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
