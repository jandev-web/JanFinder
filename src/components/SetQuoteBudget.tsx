'use client';
import React, { useState, useEffect } from 'react';
import { updateQuoteBudget } from '@/utils/updateQuoteBudget';
import getQuoteDetails from '@/utils/getQuoteDetails';
import { useRouter } from 'next/navigation';

const SetQuoteBudget: React.FC = () => {
    const [budget, setBudget] = useState('None');
    const [loading, setLoading] = useState(true);
    const [quoteID, setQuoteID] = useState<string | null>(null);
    

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
        const fetchBudget = async () => {
            try {
                console.log(quoteID)
                const details = await getQuoteDetails(quoteID);
                const quoteInfo = details.quoteInfo;
                setBudget(quoteInfo.budget || 'None');
            } catch (error) {
                console.error('Error fetching quote frequency:', error);
                //setErrorMessage('Failed to load frequency data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBudget();
    }, [quoteID]);

    const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(event.target.value);
      };
    
      const handleSaveBudget = async () => {
        try {
          await updateQuoteBudget(quoteID, budget);
          router.push('/get-a-quote/packages');
        } catch (error) {
          console.error('Error updating budget:', error);
        }
      };
    
      if (loading) return <p className="text-center text-gray-800">Loading budget...</p>;
    
      return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
          <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Set Budget</h2>
          <p className="text-lg font-semibold mb-4">
            Current Budget: {budget ? budget : 'None'}
          </p>
          <input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            placeholder="Enter your budget"
            className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
          />
          <button
            onClick={handleSaveBudget}
            className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
          >
            Save Budget
          </button>
        </div>
      );
    };
    
    export default SetQuoteBudget;
