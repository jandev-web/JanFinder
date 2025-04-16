'use client';
import React, { useState, useEffect } from 'react';
import { updateQuoteBudget } from '@/utils/updateQuoteBudget';
import getQuoteDetails from '@/utils/getQuoteDetails';
import { useRouter } from 'next/navigation';
import QuoteProgressBar from '@/components/QuoteProgressBar';
import LoadingSpinner from '@/components/loadingScreen';

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
    setLoading(true)
    try {
      await updateQuoteBudget(quoteID, budget);
      router.push('/get-a-quote/packages');
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const budgetIsValid = !isNaN(parseFloat(budget)) && parseFloat(budget) > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <QuoteProgressBar stepNumber={5} />
      <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>5</span>: Your Budget</h1>
        <p className="text-xl">
          Please enter your budget for cleaning your facility so we can put together the most suitable cleaning package for you.
        </p>
      </div>
      <div className="bg-gradient-to-br from-white to-gray-200 flex flex-col items-center p-8 mb-8 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
        <h2 className="text-3xl font-bold text-[#001F54] mb-6 text-center">
          Cleaning Budget
        </h2>
        <input
          type="number"
          value={budget}
          onChange={handleBudgetChange}
          placeholder="Enter your budget"
          className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
        />
        {(budgetIsValid) &&
          <button
          onClick={handleSaveBudget}
          className="bg-green-600 items-center hover:bg-green-500 text-center text-white py-3 px-6 rounded transition duration-300 mt-8">
          Save Budget
        </button>
        }
        
      </div>

    </div>
  );
};

export default SetQuoteBudget;
