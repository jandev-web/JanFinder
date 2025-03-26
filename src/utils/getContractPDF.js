import { getUrl } from 'aws-amplify/storage';

const getPDFTemplate = async (quoteID) => {
    try {
        const linkToStorageFile = await getUrl({
            path: `protected/contracts/${quoteID}/contract.docx`,
        });
        //console.log(linkToStorageFile)
        return linkToStorageFile;
    } catch (error) {
        console.error('Error fetching Contract PDF:', error);
        throw error;
    }
};

export default getPDFTemplate;
