import { remove } from 'aws-amplify/storage';
import updateFranchisePDFName from '@/utils/setFranchisePDFName';

const deleteFranchiseTemplate = async (franchiseID, templateType) => {
    try {
        if (templateType === 'contract') {
            try {
                await remove({ 
                  path: `protected/contract-templates/${franchiseID}/contract-template.docx`,
                  bucket: 'janfindbucket1c1b5-dev',
                });
                updateFranchisePDFName(franchiseID, 'none', 'contract')
              } catch (error) {
                console.log('Error Deleting Contract Template', error);
              }
        } else if (templateType === 'quote') {
            try {
                await remove({ 
                  path: `protected/quote-templates/${franchiseID}/quote-template.docx`,
                  bucket: 'janfindbucket1c1b5-dev',
                });
                updateFranchisePDFName(franchiseID, 'none', 'quote')
              } catch (error) {
                console.log('Error Deleting Contract Template', error);
              }
        }
        
    } catch (error) {
        console.error('Error deleting quote template:', error);
        throw error;
    }
};

export default deleteFranchiseTemplate;

