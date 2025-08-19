import { defineFunction } from '@aws-amplify/backend';

export const calcPackageOptionsFn = defineFunction({
  name: 'calc-package-options',
  entry: './handler.ts',
  environment: {
    CUSTOMER_QUOTES_TABLE: 'CustomerQuotes',
    ROOM_TASKS_TABLE: 'RoomTaskCalculations',
    FACILITY_TABLE: 'Facility_Data',
  },
});
