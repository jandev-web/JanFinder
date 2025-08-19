import type { Handler } from 'aws-lambda';

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

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler: Handler = async (event) => {
  // quick preflight support
  if ((event as any)?.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  const body = { facility_options: facilityOptions };
  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify(body),
  };
};
