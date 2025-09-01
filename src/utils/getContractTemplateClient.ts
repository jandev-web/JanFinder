// utils/getContractTemplateClient.ts (client)
import { getUrl } from 'aws-amplify/storage';

export default async function getContractTemplate(franchiseID: string) {
  // public == accessLevel "guest" in Amplify v6
  console.log(franchiseID)
  return await getUrl({
    path: `members/franchise/${franchiseID}/templates/contract/contract-template.docx`,
    options: { validateObjectExistence: true } // throws if missing
  });
}
