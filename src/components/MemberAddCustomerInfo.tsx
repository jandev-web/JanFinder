import React, { useState, useEffect } from 'react';

interface CustomerInfoProps {
    onNext: (name: string, email: string, address: string, phone: string) => void;
    facilityInfo: { name: string; email: string; address: string; phone: string };
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ onNext, facilityInfo }) => {
    const [name, setName] = useState(facilityInfo.name);
    const [email, setEmail] = useState(facilityInfo.email);
    const [address, setAddress] = useState(facilityInfo.address);
    const [phone, setPhone] = useState(facilityInfo.phone);

    const handleSubmit = () => {
        onNext(name, email, address, phone);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Customer Contact Information</h2>

            <label className="block text-green-700 font-semibold mb-2">Name</label>
            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none focus:border-gold-500"
            />

            <label className="block text-green-700 font-semibold mb-2">Email</label>
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none focus:border-gold-500"
            />

            <label className="block text-green-700 font-semibold mb-2">Address</label>
            <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none focus:border-gold-500"
            />

            <label className="block text-green-700 font-semibold mb-2">Phone</label>
            <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 mb-6 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none focus:border-gold-500"
            />

            <button
                onClick={handleSubmit}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
                Next
            </button>
        </div>
    );
};

export default CustomerInfo;
