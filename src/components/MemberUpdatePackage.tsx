'use client';

import React from 'react';
import MemberPackageCard from './MemberPackageCard';

interface Task {
    taskName: string;
    taskFrequency: string;
}

interface Room {
    roomName: string;
    tasks: Task[];
}

interface PackageOption {
    name: string;
    rooms: Room[];
}

interface UpdatePackageChoiceProps {
    quoteID: any;
    packageOptions: PackageOption[];
    chosenPackage: PackageOption | null;
    onExit: () => void; // Function to exit update mode
    onPackageSelect: (pkg: PackageOption) => void; // Function to select a package
    cost: any;
}

const UpdatePackageChoice: React.FC<UpdatePackageChoiceProps> = ({
    quoteID,
    packageOptions,
    chosenPackage,
    onExit,
    onPackageSelect,
    cost,
}) => {
    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-7xl mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Update Package Choice</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packageOptions.map((pkg, index) => (
                    <MemberPackageCard
                        key={index}
                        singlePackage={pkg}
                        quoteID={quoteID}
                        cost={cost}
                        onSelect={(selectedPackage) => onPackageSelect(selectedPackage)} // Handle package selection
                        isSelected={chosenPackage?.name === pkg.name} // Highlight if selected
                    />
                ))}
            </div>
            <div className="mt-6 text-center">
                <button
                    onClick={onExit}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default UpdatePackageChoice;
