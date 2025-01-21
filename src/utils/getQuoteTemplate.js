import { getUrl } from 'aws-amplify/storage';

const getQuoteTemplate = async (franchiseID) => {
    try {
        const linkToStorageFile = await getUrl({
            path: `contract-templates/${franchiseID}/template.docx`,
        });
        return linkToStorageFile;
    } catch (error) {
        console.error('Error fetching quote template:', error);
        throw error;
    }
};

export default getQuoteTemplate;
