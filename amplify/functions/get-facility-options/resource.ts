import { defineFunction } from '@aws-amplify/backend';

export const getFacilityOptionsFn = defineFunction({
  name: 'get-facility-options',
  entry: './handler.ts',
  // no env needed here
});
