// functions/get-facility-options/handler.ts
import type { Schema } from '../../data/resource';

// Static options (unchanged)
const facilityOptions = {
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
};

// ✅ Amplify Data resolver only (no REST/CORS/OPTIONS)
export const handler: Schema['getFacilityOptions']['functionHandler'] = async () => {
  // Return an object; if your schema uses `a.json()`, this will be serialized to AWSJSON.
  // Your client util (below) will handle both cases.
  return { facilityOptions };
};
