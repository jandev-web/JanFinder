import React, { useState } from 'react';
import { startQuote } from '@/utils/startQuote';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/AddressForm';

interface QuoteDetailsProps {
    buildingData: { name: string; areas: string[] }[];
    user: any;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ buildingData, user }) => {
    
    const [company, setCompany] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [facilityType, setFacilityType] = useState('');
    const owner = user?.OwnerID
    const franchise = user?.franchiseID
    const router = useRouter();

    const firstName = null
    const lastName = null
    const email = 'None'
    const phone = null
    const address = null
    


    

    const handleSubmit = async () => {
        try {
            const memberMade = true;
            console.log(confirmed)
            const quoteData = await startQuote(firstName, lastName, email, phone, company, address, confirmed, facilityType, franchise, owner, memberMade);
            if (quoteData?.quoteID) {
                router.push(`/members/start-quote/quote?quoteID=${quoteData.quoteID}`);
            } else {
                console.error("Quote ID not returned from startQuote");
            }
        } catch (error) {
            console.error("Failed to start quote:", error);
        }
    };

    return (
        <div className="bg-white p-10 rounded-lg shadow-2xl max-w-lg w-full border-2 border-gray-300">

            {/* Company Name */}
            <label className="block text-lg text-[#001F54] font-semibold mb-2">Company Name</label>
            <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name"
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            {/* Status Dropdown */}
            <label className="block text-lg text-[#001F54] font-semibold mb-2">Status</label>
            <select
                value={String(confirmed)}
                onChange={(e) => setConfirmed(e.target.value === 'true')}
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
                <option value="" disabled>Status</option>
                <option value="false">Prospect</option>
                <option value="true">Confirmed</option>
            </select>

            {/* Facility Type Dropdown */}
            <label className="block text-lg text-[#001F54] font-semibold mb-2">Facility Type</label>
            <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
                <option value="" disabled>Select Facility Type</option>
                {buildingData.map((facility, index) => (
                    <option key={index} value={facility.name}>{facility.name}</option>
                ))}
            </select>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
            >
                Start Quote
            </button>
        </div>
    );
};

export default QuoteDetails;
