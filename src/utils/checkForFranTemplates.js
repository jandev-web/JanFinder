import getFranchiseInfo from './getFranchiseInfo';

const checkFranchiseTemplates = async (franchise) => {
  if (!franchise) {
    throw new Error("franchiseID is required");
  }
  
  const missingTemplates = [];
  

  try {
    
    const contractTemplate = franchise.contractTemplate;
    if (contractTemplate === 'none') {
      missingTemplates.push("Contract");
    }
    
    const quoteTemplate = franchise.quoteTemplate;
    if (quoteTemplate === 'none') {
      missingTemplates.push("Quote");
    }
  } catch (error) {
    console.error('Error fetching templates:', error);
  }
  
  return missingTemplates;
};

export default checkFranchiseTemplates;
