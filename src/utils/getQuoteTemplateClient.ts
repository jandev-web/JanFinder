// utils/getQuoteTemplate.ts (client)
import { getUrl } from 'aws-amplify/storage';

export default async function getQuoteTemplate(franchiseID: string) {
  // public == accessLevel "guest" in Amplify v6
  console.log(franchiseID)
  return await getUrl({
    path: `members/franchise/${franchiseID}/templates/quote/quote-template.docx`,
    options: { validateObjectExistence: true } // throws if missing
  });
}
