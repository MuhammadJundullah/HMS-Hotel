"use client";

import React, { useState } from 'react';
import { Room, RoomCategory, RoomType } from '@/types/room';

// Define UserRole type if not imported
type UserRole = 'ADMIN' | 'ROOM_PREPARER' | 'USER'; 

interface RoomCardProps {
  room: Room;
  userRole: UserRole;
  onDelete: (id: number) => void;
  onUpdate: (updatedRoom: Room) => void;
}

export default function RoomCard({ room, userRole, onDelete, onUpdate }: RoomCardProps) {
  console.log('RoomCard rendered with room:', room);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoomNumber, setEditedRoomNumber] = useState(room.roomNumber);
  const [editedCategory, setEditedCategory] = useState<RoomCategory>(room.category);
  const [editedType, setEditedType] = useState<RoomType>(room.type);
  const [editedFloor, setEditedFloor] = useState(room.floor);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getCategoryColor = (category: RoomCategory): string => {
    switch (category) {
      case 'KOSONG': 
        return 'bg-green-200';
      case 'TERISI': 
        return 'bg-red-200';
      case 'DIBERSIHKAN': 
        return 'bg-blue-200';
      case 'PERBAIKAN':
        return 'bg-yellow-200';
      default:
        return 'bg-gray-200'; 
    }
  };

  const handleUpdateRoomDetails = async () => {
    const confirmation = window.confirm(`Apakah Anda yakin ingin mengubah detail kamar ${room.roomNumber}?`);
    if (!confirmation) return;

    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomNumber: editedRoomNumber,
          category: editedCategory,
          type: editedType,
          floor: editedFloor,
        }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui detail kamar.');
      const updatedRoom = await res.json();
      onUpdate(updatedRoom);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating room details:', error);
      alert('Gagal memperbarui detail kamar.');
    }
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as RoomCategory;
    setEditedCategory(newCategory);
    const confirmation = window.confirm(`Apakah Anda yakin ingin mengubah kategori kamar ${room.roomNumber} menjadi ${newCategory}?`);
    if (!confirmation) return;

    setIsUpdatingCategory(true);
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui kategori kamar.');
      const updatedRoom = await res.json();
      onUpdate(updatedRoom);
    } catch (error) {
      console.error('Error updating room category:', error);
      alert('Gagal memperbarui kategori kamar.');
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(`Apakah Anda yakin ingin menghapus kamar ${room.roomNumber}? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmation) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/rooms/${room.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus kamar.');
      }
      onDelete(room.id); 
    } catch (error) {
      console.error('Error deleting room:', error);
      alert((error as Error).message);
      setIsDeleting(false);
    }
  };

  return (
    <div className={`p-3 sm:p-4 text-gray-800 rounded-lg shadow-md ${getCategoryColor(room.category)}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        {isEditing && userRole === 'ADMIN' ? (
          <input
            type="text"
            value={editedRoomNumber}
            onChange={(e) => setEditedRoomNumber(e.target.value)}
            className="text-lg sm:text-xl font-bold w-full sm:w-24 mb-2 sm:mb-0"
          />
        ) : (
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">{room.roomNumber}</h2>
        )}
        {userRole === 'ADMIN' && (
          <button onClick={() => setIsEditing(!isEditing)} className="sm:block hidden text-blue-600 text-sm px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-100 transition-colors hover:cursor-pointer">
            {isEditing ? 'Batal' : 'Edit Kamar'}
          </button>
        )}
      </div>
      {isEditing && userRole === 'ADMIN' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div>
              <label htmlFor="editCategory" className="block mb-1 text-xs  font-bold text-black">
                Status
              </label>
              <select
                id="editCategory"
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value as RoomCategory)}
                className="w-full p-1 text-black rounded-md text-xs"
              >
                <option value="KOSONG">Kamar Kosong</option>
                <option value="TERISI">Ada Tamu</option>
                <option value="DIBERSIHKAN">Sedang di Bersihkan</option>
                <option value="PERBAIKAN">Sedang di Perbaiki</option>
              </select>
            </div>
            <div>
              <label htmlFor="editType" className="block mb-1 text-xs font-bold text-black">
                Tipe
              </label>
              <select
                id="editType"
                value={editedType}
                onChange={(e) => setEditedType(e.target.value as RoomType)}
                className="w-full p-1 text-black rounded-md text-xs"
              >
                <option value="FAMILY">Family Room</option>
                <option value="EXECUTIVE">Executive Room</option>
                <option value="DELUXE">Deluxe Room</option>
                <option value="SUPERIOR">Superior Room</option>
                <option value="STANDARD">Standard Room</option>
              </select>
            </div>
            <div>
              <label htmlFor="editFloor" className="block mb-1 text-xs font-bold text-black">
                Lantai
              </label>
              <input
                id="editFloor"
                type="number"
                value={editedFloor}
                onChange={(e) => setEditedFloor(parseInt(e.target.value))}
                className="w-full p-1 text-black rounded-md text-xs"
              />
            </div>
          </div>
          <button
            onClick={handleUpdateRoomDetails}
            className="w-full px-3 py-2 mt-4 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:cursor-pointer"
          >
            Simpan
          </button>
        </>
      ) : (
        <div className="text-sm">
          <p><span className="font-bold">Status:</span> {room.category}</p>
          <p><span className="font-bold">Tipe:</span> {room.type}</p>
          <p><span className="font-bold">Lantai:</span> {room.floor}</p>

          {(userRole === 'ADMIN' || userRole === 'ROOM_PREPARER') && (
            <div className="mt-3">
              <label htmlFor="category" className="block mb-1 text-xs font-bold text-black">
                Ubah Status
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={room.category}
                  onChange={handleCategoryChange} 
                  disabled={isUpdatingCategory} 
                  className={`w-full p-1 text-black rounded-md text-xs hover:cursor-pointer ${isUpdatingCategory ? 'opacity-50' : ''}`}
                >
                  <option value="KOSONG">Kamar Kosong</option>
                  <option value="TERISI">Ada Tamu</option>
                  <option value="DIBERSIHKAN">Sedang di Bersihkan</option>
                  <option value="PERBAIKAN">Sedang di Perbaiki</option>
                </select>
                {isUpdatingCategory && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md">
                    <div className="w-4 h-4 border-2 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
         {userRole === 'ADMIN' && (
          <button onClick={() => setIsEditing(!isEditing)} className="sm:hidden block w-full px-3 py-2 mt-3 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            {isEditing ? 'Batal' : 'Edit Kamar'}
          </button>
        )}
      {userRole === 'ADMIN' && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full px-3 py-2 mt-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 hover:cursor-pointer"
        >
          {isDeleting ? 'Menghapus...' : 'Hapus Kamar'}
        </button>
      )}
    </div>
  );
}
