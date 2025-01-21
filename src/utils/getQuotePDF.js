import { getUrl } from 'aws-amplify/storage';

const getQuotePDF = async (quoteID) => {
    try {
        const linkToStorageFile = await getUrl({
            path: `contracts/${quoteID}/contract.docx`,
        });
        return linkToStorageFile;
    } catch (error) {
        console.error('Error fetching quote PDF:', error);
        throw error;
    }
};

export default getQuotePDF;
