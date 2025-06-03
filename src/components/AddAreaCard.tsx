import React, { useState } from 'react';

interface Area {
  areaName: string;
}

interface AddAreaCardProps {
  area: Area; // Array of all states with regions and areas
  onRegionsChange: (selectedRegions: any) => void; // Callback function to update selected regions
}

const AddAreaCard: React.FC<AddAreaCardProps> = ({ area, onRegionsChange }) => {
  
  const [selectedAreas, setSelectedAreas] = useState<any>({}); // Selected regions and areas
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null); // Track expanded region
  console.log(area)
  
  

  

  

  

  const handleAreaSelection = () => {
    

    
    
  };

  
  return (
    <div className="space-y-4">
      <p>{area.areaName}</p>
            
    </div>
  );
};

export default AddAreaCard;
