'use client';
import React, { useState, useEffect } from 'react';
import updateQuoteFrequency from '@/utils/updateQuoteFrequency';
import getQuoteDetails from '@/utils/getQuoteDetails';
import { useRouter } from 'next/navigation';
import { calculateUpdateCost } from '@/utils/calculateUpdateCost'
const SetQuoteFrequency: React.FC = () => {
    const [frequency, setFrequency] = useState('None');
    const [loading, setLoading] = useState(true);
    const [quoteID, setQuoteID] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const frequencyOptions = [
        'None', 'One Time', 'Weekly', '2 Days a Week', '3 Days a Week', '4 Days a Week', '5 Days a Week', '6 Days a Week', '7 Days a Week', '1 Day a Month', 'Quarterly', 'Yearly'
    ];

    const router = useRouter();


    useEffect(() => {
        if (typeof window !== "undefined") {
          const storedQuoteID = sessionStorage.getItem('customerData');
          setQuoteID(storedQuoteID);
        }
        setLoading(false);
      }, []);

    useEffect(() => {
        if (!quoteID) return;
        const fetchFrequency = async () => {
            try {
                console.log(quoteID)
                const details = await getQuoteDetails(quoteID);
                const quoteInfo = details.quoteInfo;
                setFrequency(quoteInfo.frequency || 'None');
            } catch (error) {
                console.error('Error fetching quote frequency:', error);
                //setErrorMessage('Failed to load frequency data.');
            } finally {
                setLoading(false);
            }
        };

        fetchFrequency();
    }, [quoteID]);

    const handleFrequencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFrequency(event.target.value);
    };

    const handleSaveFrequency = async () => {
        try {
            await updateQuoteFrequency(quoteID, frequency);
            setIsEditing(false);
            await calculateUpdateCost(quoteID, frequency);
            router.push('/get-a-quote/budget')
        } catch (error) {
            console.error('Error updating frequency:', error);
            setErrorMessage('Failed to update frequency.');
        }
    };

    if (loading) return <p>Loading frequency...</p>;

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Set Frequency</h2>
            {!isEditing ? (
                <>
                    <p className="text-lg font-semibold mb-4">Current Frequency: {frequency}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
                    >
                        Edit Frequency
                    </button>
                </>
            ) : (
                <>
                    <label className="block text-yellow-500 font-semibold mb-2">Cleaning Frequency</label>
                    <select
                        value={frequency}
                        onChange={handleFrequencyChange}
                        className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
                    >
                        {frequencyOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                    {errorMessage && <p className="text-red-500 font-semibold mb-4">{errorMessage}</p>}
                    <button
                        onClick={handleSaveFrequency}
                        className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
                    >
                        Save Frequency
                    </button>
                </>
            )}
        </div>
    );
};

export default SetQuoteFrequency;
