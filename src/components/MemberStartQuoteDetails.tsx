import React, { useState } from 'react';
import { startQuote } from '@/utils/startQuote';
import { useRouter } from 'next/navigation';

interface QuoteDetailsProps {
    buildingData: { name: string; areas: string[] }[];
    cbo: any;
    franchise: any;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ buildingData, cbo, franchise }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [address, setAddress] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [facilityType, setFacilityType] = useState('');

    const router = useRouter();
    console.log(cbo)
    const handleSubmit = async () => {
        try {
            const memberMade = true
            const quoteData = await startQuote(firstName, lastName, email, phone, company, address, confirmed, facilityType, franchise, cbo, memberMade);
            
            const quoteID = quoteData?.quoteID
            if (quoteID) {
                
                router.push(`/members/startQuote/quote?quoteID=${quoteID}`);
                
            } else {
                console.error("Quote ID not returned from startQuote");
            }
        } catch (error) {
            console.error("Failed to start quote:", error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Quote Details</h2>

            <label className="block text-green-700 font-semibold mb-2">Company/Client</label>
            <input
                type="text"
                placeholder="Enter company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none focus:border-gold-500"
            />

            <label className="block text-green-700 font-semibold mb-2">Status</label>
            <select
                value={String(confirmed)}
                onChange={(e) => setConfirmed(e.target.value === 'true')}
                className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none focus:border-gold-500"
            >
                <option value="" disabled>Status</option>
                <option value="false">Prospect</option>
                <option value="true">Confirmed</option>
            </select>

            <label className="block text-green-700 font-semibold mb-2">Facility Type</label>
            <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full p-2 mb-6 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none focus:border-gold-500"
            >
                <option value="" disabled>Select Facility Type</option>
                {buildingData.map((facility, index) => (
                    <option key={index} value={facility.name}>{facility.name}</option>
                ))}
            </select>

            <button
                onClick={handleSubmit}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
                Next
            </button>
        </div>
    );
};

export default QuoteDetails;
