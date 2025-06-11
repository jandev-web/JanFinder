import React, { useState, useEffect } from 'react';
import AddRegionCard from './AddRegionCard'; // Import AddRegionCard component
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

interface Area {
    areaName: string;
}

interface Region {
    regionName: string;
    areas: Area[];
}

interface State {
    stateName: string;
    stateRegions: Region[];
}

interface AddStateCardProps {
    stateOption: State; // State containing the name and regions
    onRemoveState: (state: State) => void;
    
    selectedRegions: any;
    onRegionsChange: (selectedRegions: any) => void;
}

const AddStateCard: React.FC<AddStateCardProps> = ({
    stateOption,
    onRemoveState,
    
    selectedRegions,
    onRegionsChange
}) => {
    
    const [expandedState, setExpandedState] = useState<boolean>(false); // State expansion toggle

    // Function to handle region selection/deselection
    const handleRegionSelection = (region: Region) => {
        const regionName = region.regionName;
        const newSelectedRegions = { ...selectedRegions };
        console.log(newSelectedRegions)
        // If the state has selected regions, toggle the selection
        if (newSelectedRegions[stateOption.stateName]) {
            const regionIndex = newSelectedRegions[stateOption.stateName].findIndex(
                (r: Region) => r.regionName === regionName
            );

            if (regionIndex !== -1) {
                // Remove the region if it is selected
                newSelectedRegions[stateOption.stateName].splice(regionIndex, 1);
            } else {
                // Add the region if it is not selected
                newSelectedRegions[stateOption.stateName].push(region);
            }
        } else {
            // If no regions are selected yet, initialize with the current region
            newSelectedRegions[stateOption.stateName] = [region];
        }

        onRegionsChange(newSelectedRegions);
    };

    const handleSelectEntireState = () => {
        const newSelectedRegions = { ...selectedRegions };

        // If all regions are already selected, unselect them
        const allRegionsSelected =
            newSelectedRegions[stateOption.stateName]?.length === stateOption.stateRegions.length;

        if (allRegionsSelected) {
            newSelectedRegions[stateOption.stateName] = []; // Remove all regions from selection
        } else {
            // Select all regions if not all are selected
            newSelectedRegions[stateOption.stateName] = stateOption.stateRegions;
        }

        onRegionsChange(newSelectedRegions);
        // Update the parent component's state
    };

    const toggleStateExpansion = () => {
        setExpandedState((prev) => !prev); // Toggle the expanded state to show/hide regions
    };

    const isRegionSelected = (region: Region) => {
        const selectedRegionsForState = selectedRegions[stateOption.stateName] || [];
        const isSelected = selectedRegionsForState.some(
            (r: Region) => r.regionName === region.regionName
        );
        return isSelected; // Return true or false explicitly
    };

    

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                {/* Button to toggle the dropdown */}
                <Typography component="span" className="flex items-center space-x-4">
                    <Checkbox
                        checked={selectedRegions[stateOption.stateName]?.length === stateOption.stateRegions.length}
                        onChange={handleSelectEntireState}
                    />
                    <p className="font-semibold text-lg">{stateOption.stateName}</p>
                    <button
                        onClick={() => onRemoveState(stateOption)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <DeleteIcon />
                    </button>
                    {/* Button to toggle the dropdown visibility */}
                    <button onClick={toggleStateExpansion} className="text-blue-500 hover:text-blue-700">
                        {expandedState ? 'Hide Regions' : 'Show Regions'}
                    </button>
                </Typography>
            </div>

            {/* Conditional rendering of the dropdown */}
            {expandedState && (
                <div className="mt-4 space-y-2">
                    {stateOption.stateRegions.map((region) => (
                        <AddRegionCard region={region} key={region.regionName} isSelected={isRegionSelected(region)} handleRegionSelection={handleRegionSelection} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddStateCard;
