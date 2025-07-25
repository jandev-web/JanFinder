'use client';

import React, { useState, useEffect } from 'react';
import updateQuoteFrequency from '@/utils/updateQuoteFrequency';
import { calculateTime } from '@/utils/calculateTime'
import LoadingSpinner from '@/components/loadingScreen';

interface QuoteFormProps {
    quoteID: any;
    quoteFrequency: any;
    onNextStep: (stepNumber: number) => void;
    onMoveOn: (moveOn: boolean) => void;
    onChangeFrequency: (newFrequency: any, calculatedPackages: any) => void;
    onCanClick: (step: any, canClick: boolean) => void;
}

const UpdateQuoteFrequency: React.FC<QuoteFormProps> = ({ onCanClick, quoteID, quoteFrequency, onNextStep, onMoveOn, onChangeFrequency }) => {
    const [frequency, setFrequency] = useState<any>(quoteFrequency || '');
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    
    const frequencyOptions = [
        'One Time', 'Weekly', '2 Days a Week', '3 Days a Week', '4 Days a Week', '5 Days a Week', '6 Days a Week', '7 Days a Week', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Yearly'
    ];



    useEffect(() => {
        if (!frequency || frequency === '' || (frequency != quoteFrequency)) {
            onMoveOn(false);
        }

    }, [frequency]);



    const handleFrequencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFrequency(event.target.value);
    };

    const handleSaveFrequency = async () => {
        try {
            setLoading(true)
            
            await updateQuoteFrequency(quoteID, frequency);
            const calculatedPackages = await calculateTime(quoteID)
            onChangeFrequency(frequency, calculatedPackages.packageOptions);
            onNextStep(5)
            onCanClick(5, true)
        } catch (error) {
            console.error('Error updating frequency:', error);
            setErrorMessage('Failed to update frequency.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>4</span>: Cleaning Frequency</h1>
                <p className="text-xl">
                    Please choose how frequently you would like your facility to be cleaned.
                </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-200 flex flex-col items-center p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
                <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
                    Cleaning Frequency
                </h2>
                <select
                    name='frequency'
                    value={frequency}
                    onChange={handleFrequencyChange}
                    required
                    className="w-full p-3 border border-yellow-500 rounded-xl text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    <option value="" disabled>
                        Select Frequency
                    </option>
                    {frequencyOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                {errorMessage && <p className="text-red-400 font-medium mb-4">{errorMessage}</p>}
                {((frequency != '') && (frequency != quoteFrequency)) &&
                    <button onClick={handleSaveFrequency} className="bg-green-600 items-center hover:bg-green-500 text-center text-white py-3 px-6 rounded transition duration-300 mt-8">
                        Confirm Frequency
                    </button>
                }
            </div>


        </div>

    );
};

export default UpdateQuoteFrequency;
