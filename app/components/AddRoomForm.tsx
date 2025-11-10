"use client";

import { useState } from 'react';
import { RoomCategory, RoomType } from '@/types/room';

interface AddRoomFormProps {
  onAddRoom: (roomNumber: string, category: RoomCategory, type: RoomType, floor: number) => void;
}

export default function AddRoomForm({ onAddRoom }: AddRoomFormProps) {
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState<RoomCategory>('KOSONG');
  const [type, setType] = useState<RoomType>('STANDARD');
  const [floor, setFloor] = useState<string | number>(1); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || floor === '') return;
    onAddRoom(roomNumber, category, type, typeof floor === 'string' ? parseInt(floor, 10) : floor);
    setRoomNumber('');
    setFloor(1); 
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 my-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Tambah Kamar Baru</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="Nomor kamar"
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        />
        <input
          type="number"
          value={floor}
          onChange={(e) => setFloor(e.target.value === '' ? '' : parseInt(e.target.value, 10))} // Handle empty string
          placeholder="Lantai"
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as RoomCategory)}
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        >
          <option value="KOSONG">Kamar Kosong</option>
          <option value="TERISI">Ada Tamu</option>
          <option value="DIBERSIHKAN">Sedang di Bersihkan</option>
          <option value="PERBAIKAN">Sedang di Perbaiki</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as RoomType)}
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        >
          <option value="FAMILY">Family Room</option>
          <option value="EXECUTIVE">Executive Room</option>
          <option value="DELUXE">Deluxe Room</option>
          <option value="SUPERIOR">Superior Room</option>
          <option value="STANDARD">Standard Room</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Tambah Kamar
      </button>
    </form>
  );
}
