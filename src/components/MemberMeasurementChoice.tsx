'use client';
import AutoAddRoom from './AutoAddRoom';
import ManualAddRoom from './ManualAddRoom';
import React, { useState, useEffect } from 'react';
import { getFacilityOptions } from '@/utils/getFacilityOptions';
import getQuoteDetails from '@/utils/getQuoteDetails';

interface MeasurementChoiceProps {
    quoteID: any;
}

const MeasurementChoice: React.FC<MeasurementChoiceProps> = ({ quoteID }) => {
    const [measurementType, setMeasurementType] = useState<string | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [facilityRooms, setFacilityRooms] = useState<string[]>([]);
    const [facilityPercents, setFacilityPercents] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const facilityDetails = await getFacilityOptions();
                const quoteDetails = await getQuoteDetails(quoteID);
                const facilityType = quoteDetails.quoteInfo?.facilityType || '';

                setRooms(quoteDetails.quoteInfo?.selectedRooms || []);
                setFacilityRooms(facilityDetails?.facility_options[facilityType] || []);
                setFacilityPercents(facilityDetails?.facility_percents[facilityType] || {});
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);

    const handleSelection = (type: 'auto' | 'manual') => {
        if (measurementType !== type && measurementType !== null) {
            if (measurementType === 'manual' && type === 'auto'){
                setShowPrompt(true);
            }
            
            setMeasurementType(type);
        } else {
            setMeasurementType(type);
        }
    };

    const handleConfirmChange = () => setShowPrompt(false);
    
    const handleCancelChange = () => {
        setMeasurementType(null);
        setShowPrompt(false);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Measurement Choice</h2>

            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => handleSelection('auto')}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Automatic
                </button>
                <button
                    onClick={() => handleSelection('manual')}
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                >
                    Manual
                </button>
            </div>

            {showPrompt && (
                <div className="clear-prompt mt-6">
                    <p className="text-red-500 font-semibold">
                        Warning: Switching measurement type will reset your current room measurements.
                    </p>
                    <button
                        onClick={handleConfirmChange}
                        className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={handleCancelChange}
                        className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {!showPrompt && measurementType === 'auto' && (
                <AutoAddRoom quoteID={quoteID} facilityPercents={facilityPercents} />
            )}
            {!showPrompt && measurementType === 'manual' && (
                <ManualAddRoom quoteID={quoteID} facilityRooms={facilityRooms} currentRooms={rooms} />
            )}
        </div>
    );
};

export default MeasurementChoice;
