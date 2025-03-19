import { getUrl } from 'aws-amplify/storage';

const getPDFTemplate = async (franchiseID) => {
    try {
        const linkToStorageFile = await getUrl({
            path: `public/contract-templates/${franchiseID}/template.docx`,
        });
        //console.log(linkToStorageFile)
        return linkToStorageFile;
    } catch (error) {
        console.error('Error fetching quote PDF:', error);
        throw error;
    }
};

export default getPDFTemplate;
