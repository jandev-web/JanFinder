import React, { useState } from 'react';
import AddStateCard from './AddStateCard'; // Import AddStateCard component

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

interface SelectOwnerRegionsProps {
  allRegions: State[]; // Array of all states with regions and areas
  selectedRegions: any; // { stateName: { selectedRegions: [], areas: [] } }
  onRegionsChange: (selectedRegions: any) => void; // Callback function to update selected regions
}

const SelectOwnerRegions: React.FC<SelectOwnerRegionsProps> = ({
  allRegions,
  selectedRegions,
  onRegionsChange,
}) => {
  const [selectedState, setSelectedState] = useState<string>(''); // Selected state from dropdown
  const [statesToShow, setStatesToShow] = useState<State[]>([]); // States that the user has added

  const handleStateSelection = (stateName: string) => {
    setSelectedState(stateName);
  };

  const addState = () => {
    const state = allRegions.find((s) => s.stateName === selectedState);
    if (state && !statesToShow.includes(state)) {
      setStatesToShow((prev) => [...prev, state]);
    }
  };
  
  const removeState = (state: State) => {
    const stateName = state.stateName;
    setStatesToShow((prev) => prev.filter((state) => state.stateName !== stateName));
    const newSelectedRegions = { ...selectedRegions };
    delete newSelectedRegions[stateName];
    onRegionsChange(newSelectedRegions); // Only call if needed
  };
  

 

  

  return (
    <div className="space-y-4">
      {/* Dropdown to select state */}
      <div>
        <label htmlFor="state" className="block text-gray-700 font-semibold mb-2">
          Select State:
        </label>
        <select
          id="state"
          value={selectedState}
          onChange={(e) => handleStateSelection(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
        >
          <option value="">Select state</option>
          {allRegions.map((state) => (
            <option key={state.stateName} value={state.stateName}>
              {state.stateName}
            </option>
          ))}
        </select>
        <button
          onClick={addState}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add State
        </button>
      </div>

      {/* Display added states and regions */}
      {statesToShow.map((stateOption) => (
        <AddStateCard
          key={stateOption.stateName}
          stateOption={stateOption}
          onRemoveState={removeState} // Pass the remove function for each state
          selectedRegions={selectedRegions} // Pass the selected regions
          onRegionsChange={onRegionsChange} // Pass the function to update selected regions
        />
      ))}
    </div>
  );
};

export default SelectOwnerRegions;
