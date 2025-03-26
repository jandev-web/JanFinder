import { getUrl } from 'aws-amplify/storage';

const getContractTemplate = async (franchiseID) => {
    try {
        const linkToStorageFile = await getUrl({
            path: `protected/contract-templates/${franchiseID}/contract-template.docx`,
        });
        return linkToStorageFile;
    } catch (error) {
        console.error('Error fetching quote template:', error);
        throw error;
    }
};

export default getContractTemplate;
