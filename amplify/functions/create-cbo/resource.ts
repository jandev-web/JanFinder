import { pythonFn } from '../../utils/pythonFn';

export const createCboFn = pythonFn('create-cbo', {
  dir: '.', 
  environment: {
    CBO_TABLE_NAME: 'CBO_DB',
    OWNER_TABLE_NAME: 'Owner_DB',
    S3_BUCKET: 'cbo-pic-storage',
  },
});
