import { pythonFn } from '../../utils/pythonFn';

export const createOwnerFn = pythonFn('create-cbo', {
  dir: '.', 
  environment: {
    OWNER_TABLE: 'Owner_DB',
    S3_BUCKET: 'cbo-pic-storage',
  },
});
