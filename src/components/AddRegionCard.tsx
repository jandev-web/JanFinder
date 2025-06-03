import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';

interface Area {
    areaName: string;
}

interface Region {
    regionName: string;
    areas: Area[];
}

interface AddRegionCardProps {
    
    
    region: Region; // A specific region with areas
    
    isSelected: boolean;
    handleRegionSelection: (region: Region) => void;
}

const AddRegionCard: React.FC<AddRegionCardProps> = ({ region, handleRegionSelection, isSelected }) => {
    const [userSelected, setIsSelected] = useState<boolean>(isSelected); // Track selection state of the region
    console.log(`${region.regionName}: ${userSelected}`)
    // Function to handle selecting and unselecting the region
    const handleSelectRegion = (region: Region) => {
        handleRegionSelection(region);
        setIsSelected(!userSelected);
    };

    return (
        <div key={region.regionName} className="flex justify-between items-center">
            <Checkbox
                checked={userSelected} // Ensure this is always a boolean
                onChange={() => handleSelectRegion(region)}
            />
            <p className="font-semibold">{region.regionName}</p>
        </div>
    );
};

export default AddRegionCard;
