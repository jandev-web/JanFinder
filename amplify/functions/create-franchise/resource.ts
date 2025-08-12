import { pythonFn } from '../../utils/pythonFn';

export const createFranchiseFn = pythonFn('create-cbo', {
  dir: '.', 
  environment: {
    FRANCHISE_TABLE: 'Franchise_DB',
  },
});
