'use client';

import React, { useState, useEffect } from 'react';
import MemberEditAddressForm from './MemberEditAddressForm';
import getQuoteDetails from '@/utils/getQuoteDetails';

interface AddFacilityDetailsProps {
    quoteID: any;
}

const AddFacilityDetails: React.FC<AddFacilityDetailsProps> = ({ quoteID }) => {
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const details = await getQuoteDetails(quoteID);
                const address = details.customerData?.address || {};
                setStreet(address.street || '');
                setCity(address.city || '');
                setState(address.state || '');
                setPostalCode(address.postalCode || '');
                setCountry(address.country || '');
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);

    const handleAddressChange = (field: string, value: string) => {
        switch (field) {
            case 'street': setStreet(value); break;
            case 'city': setCity(value); break;
            case 'state': setState(value); break;
            case 'postalCode': setPostalCode(value); break;
            case 'country': setCountry(value); break;
        }
    };

    

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Facility Address Information</h2>
            
            <MemberEditAddressForm
                street={street}
                city={city}
                state={state}
                postalCode={postalCode}
                country={country}
                quoteID={quoteID}
                onAddressChange={handleAddressChange}
            />

        </div>
    );
};

export default AddFacilityDetails;
