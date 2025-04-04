import getFranchiseInfo from './getFranchiseInfo';

const checkFranchiseTemplates = async (franchiseID) => {
  if (!franchiseID) {
    throw new Error("franchiseID is required");
  }
  
  const missingTemplates = [];
  console.log("Checking for franchise templates:", franchiseID);

  try {
    const data = await getFranchiseInfo(franchiseID);
    
    const contractTemplate = data.contractTemplate;
    if (contractTemplate === 'none') {
      missingTemplates.push("Contract");
    }
    
    const quoteTemplate = data.quoteTemplate;
    if (quoteTemplate === 'none') {
      missingTemplates.push("Quote");
    }
  } catch (error) {
    console.error('Error fetching templates:', error);
  }
  
  return missingTemplates;
};

export default checkFranchiseTemplates;
