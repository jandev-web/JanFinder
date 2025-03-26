'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OwnerQuoteCard from '@/components/OwnerQuoteCard';
import LoadingSpinner from '@/components/loadingScreen';
import fetchOwnerById from '@/utils/getOwnerById'
import getFranchiseInfo from '@/utils/getFranchiseInfo'
import fetchFilteredQuotes from '@/utils/getFilteredQuotesOwner';


type Address = {
    city: string;
    postalCode: string;
    state: string;
};

interface Quote {
    QuoteID: string;
    costInfo: {
        finalCost: number;
    };
    CBO: string;
    Timestamp: string;
    Package: {
        name: string;
        cost: number;
    };
    customerData: {
        firstName: string;
        lastName: string;
        company: string;
        address: Address;
    };
    quoteInfo: {
        sqft: string;
    };
}

interface CustomQuotesProps {
    user: any;
}

const CustomQuotes: React.FC<CustomQuotesProps> = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const ownerID = user?.OwnerID;
    const [franInfo, setFranInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);



    const handleQuoteClick = (quote: Quote) => {
        router.push(`/members/owner/quote?quoteID=${quote.QuoteID}&page=acc`);
    };

    useEffect(() => {
        if (ownerID) {
            const fetchInfo = async () => {
                try {
                    const data = await fetchFilteredQuotes(ownerID);
                    //console.log(data.memberConfirmed)
                    const confirmedQuotes = data.memberConfirmed
                    setQuotes(confirmedQuotes)
                    const fetchedOwnerInfo = await fetchOwnerById(ownerID);
                    //console.log(fetchedOwnerInfo)
                    const franchiseInfo = await getFranchiseInfo(fetchedOwnerInfo.franchiseID)
                    //console.log(franInfo)
                    setFranInfo(franchiseInfo.franchiseName);
                    setLoading(false);

                } catch (error) {
                    console.error('Error fetching quotes:', error);
                    setLoading(false);
                }
            };

            fetchInfo();
        }
    }, [ownerID]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (

        <div className="relative">
            <button
                className="absolute top-4 left-4 pt-2 pb-2 pl-4 pr-4 text-lg font-semibold hover:text-yellow-500 text-[#001F54] transition duration-300"
                onClick={() => router.push('/members/owner/quotes')}
            >
                &lt; Back to All Quotes
            </button>
            {/* Other component content goes here */}

            <div className="p-8 text-center">
                <h1 className="text-4xl font-bold text-[#001F54] mb-10">
                    {franInfo}&apos;s <span className="text-yellow-500">Custom Quotes</span>
                </h1>

                <div>
                    <div>
                        <h2 className="text-2xl font-bold text-center">
                            <span className="text-yellow-500">Custom Quotes</span>
                        </h2>
                        {/* Grey line under the h2 */}
                        <div className="border-b border-gray-300 mx-auto mt-2"></div>

                        {quotes?.length === 0 ? (
                            <div>
                                <div className="mt-4 mb-4 text-[#001F54]">No Custom Quotes Yet.</div>
                                <button
                                    className="px-6 py-3 bg-yellow-500 text-[#001F54] text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-400 hover:shadow-lg hover:scale-105 transform transition duration-300"
                                    onClick={() => router.push('/members/start-quote')}
                                >
                                    Click here to create a custom quote!
                                </button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <button
                                        className="px-6 py-3 bg-yellow-500 text-[#001F54] text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-400 hover:shadow-lg hover:scale-105 transform transition duration-300"
                                        onClick={() => router.push('/members/start-quote')}
                                    >
                                        Click here to create a custom quote!
                                    </button>
                                </div>
                                <ul className="space-y-4 mt-6">
                                    {quotes?.map((quote) => (
                                        <li key={quote.QuoteID}>
                                            <OwnerQuoteCard quote={quote} onClick={() => handleQuoteClick(quote)} />
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>





    );
};

export default CustomQuotes;

