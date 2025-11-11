"use client";

import { useEffect, useState } from 'react';
import RoomCard from './components/RoomCard';
import AddRoomForm from './components/AddRoomForm';
import Modal from './components/Modal'; 
import { Room, RoomCategory, RoomType } from '@/types/room'; 
import { UserRole } from '@/types/user';

export default function DashboardPage() {
  const [allRooms, setAllRooms] = useState<Room[]>([]); 
  const [rooms, setRooms] = useState<Room[]>([]); 
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false); 
  const [selectedFloor, setSelectedFloor] = useState<string>(''); 
  const [availableFloors, setAvailableFloors] = useState<number[]>([]); 

  const fetchData = async () => {
    setIsLoading(true); 
    try {
      const roomsRes = await fetch(`/api/rooms`);
      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        const sortedData = roomsData.sort((a: Room, b: Room) => {
          const numA = parseInt(a.roomNumber.replace(/[^0-9]/g, ''), 10);
          const numB = parseInt(b.roomNumber.replace(/[^0-9]/g, ''), 10);
          return numA - numB;
        });
        setAllRooms(sortedData); 

        // Extract distinct floors
        const floors = (Array.from(new Set(sortedData.map((room: Room) => room.floor))) as number[]).sort((a: number, b: number) => a - b);
        setAvailableFloors(floors);
      }

      const userRes = await fetch('/api/auth/user');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUserRole(userData.role);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Apply filter whenever allRooms or selectedFloor changes
    if (selectedFloor) {
      setRooms(allRooms.filter(room => room.floor === parseInt(selectedFloor, 10)));
    } else {
      setRooms(allRooms);
    }
  }, [allRooms, selectedFloor]); 

  const handleAddRoom = async (roomNumber: string, category: RoomCategory, type: RoomType, floor: number): Promise<void> => {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomNumber, category, type, floor }),
    });

    if (res.ok) {
      const newRoom = await res.json();
      setAllRooms(prevRooms => [...prevRooms, newRoom].sort((a, b) => {
        const numA = parseInt(a.roomNumber.replace(/[^0-9]/g, ''), 10);
        const numB = parseInt(b.roomNumber.replace(/[^0-9]/g, ''), 10);
        return numA - numB;
      }));
      setIsAddRoomModalOpen(false); 
    } else if (res.status === 409) {
      const errorData = await res.json();
      alert(errorData.message);
      throw new Error(errorData.message);
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Gagal menambahkan kamar');
      throw new Error(errorData.message || 'Gagal menambahkan kamar');
    }
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setAllRooms(prevRooms => prevRooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ));
  };

  const handleDeleteRoom = (id: number) => {
    setAllRooms(prevRooms => prevRooms.filter(room => room.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 px-2">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 bg">Daftar Kamar</h1>
          <div className="flex justify-between items-center mb-4">
              <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            >
              <option value="">Semua Lantai</option>
              {availableFloors.map(floor => (
                <option key={floor} value={floor}>Lantai {floor}</option>
              ))}
            </select>
            {userRole === 'ADMIN' && (
              <button
                onClick={() => setIsAddRoomModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:cursor-pointer"
              >
                Tambah Kamar
              </button>
            )}
          </div>

          <Modal
            isOpen={isAddRoomModalOpen}
            onClose={() => setIsAddRoomModalOpen(false)}
            title="Tambah Kamar Baru"
          >
            <AddRoomForm onAddRoom={handleAddRoom} />
          </Modal>

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
                  onUpdate={handleUpdateRoom} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
