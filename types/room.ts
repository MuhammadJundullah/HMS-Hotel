export type RoomCategory = 'KOSONG' | 'TERISI' | 'DIBERSIHKAN' | 'PERBAIKAN';
export type RoomType = 'FAMILY' | 'EXECUTIVE' | 'DELUXE' | 'SUPERIOR' | 'STANDARD';

export interface Room {
  id: number;
  roomNumber: string;
  category: RoomCategory;
  type: RoomType;
  floor: number;
}