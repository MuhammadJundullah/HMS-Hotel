"use client";

import { useState } from 'react';

interface AddRoomFormProps {
  onAddRoom: (roomNumber: string) => void;
}

export default function AddRoomForm({ onAddRoom }: AddRoomFormProps) {
  const [roomNumber, setRoomNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return;
    onAddRoom(roomNumber);
    setRoomNumber('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 my-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Tambah Kamar Baru</h2>
      <div className="flex gap-4">
        <input
          type="text"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="Masukkan nomor kamar"
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Tambah Kamar
        </button>
      </div>
    </form>
  );
}
