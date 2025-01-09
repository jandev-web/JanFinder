'use client';
import React, { useState, useEffect } from 'react';
import { calculateTime } from '@/utils/calculateTime'
import MemberCostCalculator from './MemberCostCalculator';
import getQuoteDetails from '@/utils/getQuoteDetails';

interface MemberGetCostProps {
    quoteID: any;
}

const MemberGetCost: React.FC<MemberGetCostProps> = ({ quoteID }) => {
    const [times, setTimes] = useState({});
    const [totalTime, setTotalTime] = useState(0);
    const [frequency, setFrequency] = useState(0)

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const timeDetails = await calculateTime(quoteID);
                console.log(timeDetails)
                const quoteDetails = await getQuoteDetails(quoteID)
                setFrequency(quoteDetails.quoteInfo.frequency)

                setTimes(timeDetails?.times || {});
                setTotalTime(timeDetails?.totalTime || 0);
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500 text-center">
            <MemberCostCalculator initialTime={totalTime} frequency={frequency} />
        </div>
    );
};

export default MemberGetCost;
