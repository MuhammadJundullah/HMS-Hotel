"use client";

import React from 'react';
// Assuming Room type is available from prisma client or a shared types file
// import { Room, UserRole } from '@prisma/client'; // Adjust import as necessary

// Define Room type locally if not imported, based on schema
interface Room {
  id: number;
  roomNumber: string;
  status: 'TERSEDIA' | 'DIBERSIHKAN' | 'DIPESAN'; 
  
}

// Define UserRole type if not imported
type UserRole = 'ADMIN' | 'ROOM_PREPARER' | 'USER'; 

interface RoomCardProps {
  room: Room;
  userRole: UserRole;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

export default function RoomCard({ room, userRole, onDelete, onUpdate }: RoomCardProps) {
  console.log('RoomCard rendered with room:', room);

  const getStatusColor = (status: Room['status']): string => {
    switch (status) {
      case 'TERSEDIA': 
        return 'bg-green-300';
      case 'DIPESAN': 
        return 'bg-red-300';
      case 'DIBERSIHKAN': 
        return 'bg-blue-300';
      default:
        return 'bg-gray-300'; 
    }
  };

  const handleUpdateStatus = async (newStatus: Room['status']) => {
    const confirmation = window.confirm(`Apakah Anda yakin ingin mengubah status kamar ${room.roomNumber} menjadi ${newStatus}?`);
    if (!confirmation) return;

    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui status kamar.');
      onUpdate();
    } catch (error) {
      console.error('Error updating room status:', error);
      alert('Gagal memperbarui status kamar.');
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(`Apakah Anda yakin ingin menghapus kamar ${room.roomNumber}? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmation) return;

    try {
      const res = await fetch(`/api/rooms/${room.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus kamar.');
      onDelete(room.id); 
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Gagal menghapus kamar.');
    }
  };

  return (
    <div className={`p-4 text-gray-800 rounded-lg shadow-md ${getStatusColor(room.status)}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{room.roomNumber}</h2>
        {/* Removed cleanliness icon */}
      </div>
      <p className="text-sm">{room.status}</p> {/* Display translated status */}
      {/* Removed cleanliness display */}

      {(userRole === 'ADMIN' || userRole === 'ROOM_PREPARER') && (
        <div className="mt-4">
          <label htmlFor="status" className="block mb-2 text-sm font-medium text-black">
            Ubah Status
          </label>
          <select
            id="status"
            value={room.status}
            onChange={(e) => handleUpdateStatus(e.target.value as Room['status'])}
            className="w-full p-2 text-black rounded-md"
          >
            <option value="TERSEDIA">Tersedia</option>
            <option value="DIPESAN">Dipesan</option>
            <option value="DIBERSIHKAN">Dibesihkan</option>
          </select>
        </div>
      )}
      {userRole === 'ADMIN' && (
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md shadow-sm hover:bg-red-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Hapus Kamar
        </button>
      )}
    </div>
  );
}
