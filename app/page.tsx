"use client";

import { useEffect, useState } from 'react';
import RoomCard from './components/RoomCard';
import AddRoomForm from './components/AddRoomForm';

interface Room {
  id: number;
  roomNumber: string;
  status: string;
  cleanliness: string;
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userRole, setUserRole] = useState('');

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms');
    if (res.ok) {
      const data = await res.json();
      console.log('Data kamar berhasil diambil:', data);
      setRooms(data);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role);
      }
    };

    fetchRooms();
    fetchUser();
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
      fetchRooms();
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
      fetchRooms();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {userRole === 'ADMIN' && <AddRoomForm onAddRoom={handleAddRoom} />}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                userRole={userRole}
                onDelete={handleDeleteRoom}
                onUpdate={fetchRooms}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
