'use client';

import React, { useState, useEffect } from 'react';
import { updatePackage } from '@/utils/updatePackageChoice';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getPackageRecs from '@/utils/getPackageRecs';
import MemberChosenPackageCard from './MemberChosenPackage';
import UpdatePackageChoice from './MemberUpdatePackage';
import updateQuoteCost from '@/utils/updateQuoteCost';

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

interface ChoosePackageProps {
    quoteID: any;
}

const ChoosePackage: React.FC<ChoosePackageProps> = ({ quoteID }) => {
    const [packageOptions, setPackageOptions] = useState<PackageOption[]>([]);
    const [chosenPackage, setChosenPackage] = useState<PackageOption | null>(null);
    const [isEditing, setIsEditing] = useState(false); // Controls whether editing mode is active
    const [cost, setCost] = useState(0);

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const details = await getQuoteDetails(quoteID);
                const packageRecs = await getPackageRecs(quoteID);
                console.log(details)
                const costInfo = details.costInfo;
                const currentPackage = details.Package;

                setChosenPackage(currentPackage); // Set the current package

                setCost(costInfo.finalCost);
                setPackageOptions(packageRecs);
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);

    const selectPackage = async (selectedPackage: PackageOption) => {
        try {
            await updatePackage(quoteID, selectedPackage); // Update the package in the backend
            if (selectedPackage.name === 'Radiant Results') {
                const newCost = cost/1.2
                await updateQuoteCost(quoteID, { costInfo: { finalCost: newCost } });
                setCost(newCost)
            }
            if (selectedPackage.name === 'Pure Essentials') {
                const newCost = cost * 0.64;
                await updateQuoteCost(quoteID, { finalCost: newCost });
                setCost(newCost);
            }            
            setChosenPackage(selectedPackage); // Update the chosen package locally
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error selecting package:', error);
        }
    };


    if (isEditing) {
        return (
            <UpdatePackageChoice
                quoteID={quoteID}
                cost={cost}
                packageOptions={packageOptions}
                chosenPackage={chosenPackage}
                onExit={() => setIsEditing(false)} // Exit edit mode
                onPackageSelect={selectPackage} // Update chosen package
            />
        );
    }
    console.log(chosenPackage)

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-7xl mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
                {chosenPackage ? 'Your Chosen Package' : 'Choose Your Package'}
            </h2>
            {chosenPackage != null ? (
                <div>
                    <MemberChosenPackageCard chosenPackage={chosenPackage} cost={cost}/>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-400 transition"
                        >
                            Update Package Choice
                        </button>
                    </div>
                </div>
            ) : (
                <UpdatePackageChoice
                    quoteID={quoteID}
                    cost={cost}
                    packageOptions={packageOptions}
                    chosenPackage={chosenPackage}
                    onExit={() => setIsEditing(false)}
                    onPackageSelect={selectPackage}
                />
            )}
        </div>
    );
};

export default ChoosePackage;
