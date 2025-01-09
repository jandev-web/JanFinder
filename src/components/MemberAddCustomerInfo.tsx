'use client';

import React, { useState, useEffect } from 'react';
import { updateCustomerInfo } from '@/utils/memberUpdateCustomerInfo';
import getQuoteDetails from '@/utils/getQuoteDetails';

interface CustomerInfoProps {
    onNext: (firstName: string, lastName: string, email: string, phone: string) => void;
    quoteID: any;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ onNext, quoteID }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Controls edit mode

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const details = await getQuoteDetails(quoteID);
                const customerInfo = details.customerData;

                setFirstName(customerInfo?.firstName || '');
                setLastName(customerInfo?.lastName || '');
                setEmail(customerInfo?.email === 'None' ? '' : customerInfo?.email || '');
                setPhone(customerInfo?.phone || '');
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 3) return `(${cleaned}`;
        if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhoneNumber(e.target.value));
    };

    const setUpdateCustomerInfo = async () => {
        try {
            await updateCustomerInfo(quoteID, firstName, lastName, email, phone);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating customer info:', error);
        }
    };

    const displayValue = (value: string | undefined) => {
        return value?.trim() ? value : 'None';
    };

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Customer Contact Information</h2>

            {/* First Name */}
            <div className="mb-4">
                <label className="block text-yellow-500 font-semibold mb-2">
                    {isEditing ? 'First Name' : `First Name: ${displayValue(firstName)}`}
                </label>
                {isEditing && (
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
                <label className="block text-yellow-500 font-semibold mb-2">
                    {isEditing ? 'Last Name' : `Last Name: ${displayValue(lastName)}`}
                </label>
                {isEditing && (
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                )}
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-yellow-500 font-semibold mb-2">
                    {isEditing ? 'Email' : `Email: ${displayValue(email)}`}
                </label>
                {isEditing && (
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                )}
            </div>

            {/* Phone */}
            <div className="mb-4">
                <label className="block text-yellow-500 font-semibold mb-2">
                    {isEditing ? 'Phone' : `Phone: ${displayValue(phone)}`}
                </label>
                {isEditing && (
                    <input
                        type="text"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                )}
            </div>

            {/* Edit and Confirm Buttons */}
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mb-4 py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
                >
                    Edit Information
                </button>
            ) : (
                <button
                    onClick={setUpdateCustomerInfo}
                    className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all"
                >
                    Confirm
                </button>
            )}
        </div>
    );
};

export default CustomerInfo;
