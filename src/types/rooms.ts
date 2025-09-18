// types/rooms.ts

/** Canonical list of selectable room types (UI) */
export const ROOM_TYPES = [
  'Offices',
  'Restrooms',
  'Breakrooms',
  'Conference Rooms',
  'Lobby',
  'Hallways',
  'Reception Area',
  'Kitchen',
  'Storage Rooms',
  'Server Room',
  'Training Rooms',
  'Private Offices',
] as const;

export type RoomType = typeof ROOM_TYPES[number];

/** UI selection model for rooms */
export interface RoomSelection {
  /** Use roomType (not roomName) to match your current code */
  roomType: RoomType | string;
  count: number;
}
