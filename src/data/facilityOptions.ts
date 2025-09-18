// src/data/facilityOptions.ts

export const FACILITY_OPTIONS = {
  Medical: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwells',
    'Exam Rooms', 'Laboratory / Testing Rooms', 'Conference Rooms', 'Offices',
    'Treatment / Procedure Rooms', 'Storage / Utility Rooms', 'Hallways',
  ],
  Office: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Private Offices', 'Open Office / Cubicle Area', 'Conference Rooms',
    'Copy / Print / Supply Room', 'Storage / Utility Rooms', 'Hallways',
  ],
  Theater: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Concession Area', 'Ticketing / Entry Lane', 'Theater Auditorium',
    'Projection Room', 'Offices', 'Storage / Utility Rooms', 'Hallways',
  ],
  School: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Classrooms', 'Offices', 'Gymnasium', 'Cafeteria', 'Kitchen',
    'Library / Media Center', 'Nurse’s Office', 'Storage / Utility Rooms', 'Hallways',
  ],
  Retail: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Stock Room / Inventory Area', 'Sales Floor', 'Offices', 'Fitting Rooms',
    'Loading Dock / Receiving Area', 'Storage / Utility Rooms', 'Hallways',
  ],
  Dealership: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Customer Lounge', 'Showroom', 'Offices', 'Service Bays / Garage',
    'Storage / Utility Rooms', 'Hallways',
  ],
  'Religious Facility': [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Sanctuary / Worship Hall', 'Classrooms / Sunday School Rooms', 'Offices',
    'Fellowship Hall / Multi-Purpose Room', 'Kitchen', 'Storage / Utility Rooms', 'Hallways',
  ],
  Restaurant: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Dining Area', 'Bar Area', 'Kitchen', 'Storage Room / Dry Goods',
    'Offices', 'Storage / Utility Rooms', 'Hallways',
  ],
  Library: [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Library', 'Study Rooms', 'Computer Lab', 'Offices',
    'Storage / Utility Rooms', 'Hallways',
  ],
  'Fitness Facility': [
    'Single Use Bathroom', 'Multi Use Bathroom', 'Breakrooms', 'Lobby / Reception', 'Entrance', 'Stairwell',
    'Cardio Area', 'Locker Rooms', 'Weight Room', 'Sauna / Steam Room',
    'Pool Area', 'Offices', 'Storage / Utility Rooms', 'Hallways',
  ],
} as const;

export type FacilityOptions = typeof FACILITY_OPTIONS;
export type FacilityType = keyof FacilityOptions;

/** Get all facility types (keys) */
export const getFacilityTypes = (): FacilityType[] =>
  Object.keys(FACILITY_OPTIONS) as FacilityType[];

/** Get room names for a facility type */
export const getRoomsForFacility = (type: unknown): string[] => {
  const key = String(type) as keyof typeof FACILITY_OPTIONS;
  const list = FACILITY_OPTIONS[key] ?? [];
  // spread to widen readonly string[] to string[]
  return Array.isArray(list) ? [...list] : [];
};


// Optional default export
export default FACILITY_OPTIONS;
