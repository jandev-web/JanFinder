'use client';

import React, { useState, useEffect } from 'react';
import { changeFacilityType } from '@/utils/changeFacilityType';
import getQuoteDetails from '@/utils/getQuoteDetails';

interface MemberChangeFacilityTypeProps {
    quoteID: any;
    buildingData: { name: string }[];
}

const ChangeFacilityType: React.FC<MemberChangeFacilityTypeProps> = ({ quoteID, buildingData }) => {
    const [facilityType, setFacilityType] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Controls edit mode

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const details = await getQuoteDetails(quoteID);
                const currentFacilityType = details.quoteInfo?.facilityType || 'None';
                setFacilityType(currentFacilityType);
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);

    const handleFacilityTypeChange = async () => {
        try {
            await changeFacilityType(quoteID, facilityType);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating facility type:', error);
        }
    };

    const displayValue = (value: string) => {
        return value.trim() ? value : 'None';
    };

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">
                Facility Type Information
            </h2>

            {/* Facility Type Dropdown */}
            <div className="mb-4">
                <label className="block text-yellow-500 font-semibold mb-2">
                    {isEditing ? 'Facility Type' : `Facility Type: ${displayValue(facilityType)}`}
                </label>
                {isEditing && (
                    <select
                        value={facilityType}
                        onChange={(e) => setFacilityType(e.target.value)}
                        className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        {buildingData.map((building, index) => (
                            <option key={index} value={building.name}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Edit and Confirm Buttons */}
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mb-4 py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
                >
                    Edit Facility Type
                </button>
            ) : (
                <>
                    <p className="text-red-500 font-semibold mb-4">
                        Warning: Changing the facility type will delete your selected rooms and measurements.
                    </p>
                    <button
                        onClick={handleFacilityTypeChange}
                        className="w-full py-2 mb-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="w-full py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-400 transition-all"
                    >
                        Back
                    </button>
                </>
            )}
        </div>
    );
};

export default ChangeFacilityType;
