export type RoomStatus = 'TERSEDIA' | 'DIBERSIHKAN' | 'DIPESAN';

export interface Room {
  id: number;
  roomNumber: string;
  status: RoomStatus; 
}