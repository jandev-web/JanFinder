'use client';
import React, { useState, useEffect } from 'react';
import updateQuoteFrequency from '@/utils/updateQuoteFrequency';
import getQuoteDetails from '@/utils/getQuoteDetails';
import { useRouter } from 'next/navigation';
import { calculateUpdateCost } from '@/utils/calculateUpdateCost'
import QuoteProgressBar from '@/components/QuoteProgressBar';
import LoadingSpinner from '@/components/loadingScreen';

const SetQuoteFrequency: React.FC = () => {
    const [frequency, setFrequency] = useState('None');
    const [loading, setLoading] = useState(true);
    const [quoteID, setQuoteID] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    

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
            setLoading(true)
            await updateQuoteFrequency(quoteID, frequency);
            await calculateUpdateCost(quoteID, frequency);
            router.push('/get-a-quote/budget')
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <QuoteProgressBar stepNumber={4} />
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
                    value={frequency}
                    onChange={handleFrequencyChange}
                    className="w-full p-3 border border-yellow-500 rounded-xl text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    {frequencyOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                {errorMessage && <p className="text-red-400 font-medium mb-4">{errorMessage}</p>}
                {(frequency != 'None') &&
                    <button onClick={handleSaveFrequency} className="bg-green-600 items-center hover:bg-green-500 text-center text-white py-3 px-6 rounded transition duration-300 mt-8">
                        Confirm Frequency
                    </button>
                }
            </div>


        </div>

    );
};

export default SetQuoteFrequency;
