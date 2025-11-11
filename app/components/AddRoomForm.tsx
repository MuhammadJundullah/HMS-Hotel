"use client";

import { useState } from 'react';
import { RoomCategory, RoomType } from '@/types/room';

interface AddRoomFormProps {
  onAddRoom: (roomNumber: string, category: RoomCategory, type: RoomType, floor: number) => Promise<void>;
}

export default function AddRoomForm({ onAddRoom }: AddRoomFormProps) {
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState<RoomCategory>('KOSONG');
  const [type, setType] = useState<RoomType>('STANDARD');
  const [floor, setFloor] = useState<string | number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || floor === '') return;

    setIsLoading(true);
    try {
      await onAddRoom(roomNumber, category, type, typeof floor === 'string' ? parseInt(floor, 10) : floor);
      setRoomNumber('');
      setFloor(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 my-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label htmlFor="nomor_kamar" className="text-black py-2">Nomor kamar</label> 
        <input
          type="text"
          id="nomor_kamar"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="Nomor kamar"
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900"
          required
        />
        <label htmlFor="lantai" className="text-black py-2">Lantai</label> 
        <input
          type="number"
          id="lantai"
          value={floor}
          onChange={(e) => setFloor(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          placeholder="Lantai"
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900"
          required
        />
        <label htmlFor="status" className="text-black py-2">Status</label> 
        <select
          value={category}
          id="status"
          onChange={(e) => setCategory(e.target.value as RoomCategory)}
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900"
        >
          <option value="KOSONG">Kamar Kosong</option>
          <option value="TERISI">Ada Tamu</option>
          <option value="DIBERSIHKAN">Sedang di Bersihkan</option>
          <option value="PERBAIKAN">Sedang di Perbaiki</option>
        </select>
        <label htmlFor="category" className="text-black py-2">Kategori</label> 
        <select
          value={type}
          id="category"
          onChange={(e) => setType(e.target.value as RoomType)}
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900"
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
        disabled={isLoading}
        className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
      >
        {isLoading ? 'Menambah...' : 'Tambah Kamar'}
      </button>
    </form>
  );
}
