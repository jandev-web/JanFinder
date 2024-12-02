'use client';

import React, { useState, useEffect } from "react";
import fetchSubscriptionOptions from "@/utils/getSubscriptionOptions"; // Adjust the path
import { checkIsOwner } from "@/utils/checkIsOwner";

interface Subscription {
    subName: string;
    subDescription: string;
    subServices: string[];
    subCost: { type: string; cost: number }[]; // Updated to reflect array of objects
    subType: string; // 'owner' or 'cbo'
    subLevel: string; // 'basic' or 'premium'
}


interface SubscribeProps {
    user: any; // 'owner' or 'cbo'
}

const SubscriptionPage: React.FC<SubscribeProps> = ({ user }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [memberType, setMemberType] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isOwner = await checkIsOwner(user)
                if (isOwner === true) {
                    setMemberType('owner')
                }
                else {
                    setMemberType('cbo')
                }
                const data: Subscription[] = await fetchSubscriptionOptions();
                //console.log(data)
                const filteredSubscriptions = data.filter(
                    (sub: Subscription) => sub.subType === memberType
                );
                setSubscriptions(filteredSubscriptions);
            } catch (err) {
                setError("Failed to load subscription options.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [memberType]);

    const handlePurchase = (subscription: Subscription) => {
        console.log(`Purchasing subscription: ${subscription.subName}`);
        // Add your purchase logic here
    };

    if (loading) {
        return <div className="text-center text-blue-500">Loading subscriptions...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <div className="text-center p-6">
                <h1 className="text-2xl font-bold text-red-500">
                    No Subscriptions Available
                </h1>
                <p className="text-lg mt-2">
                    There are no subscriptions available for your member type.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-center mb-6">
                Available Subscriptions
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptions.map((sub, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300"
                    >
                        <h2 className="text-2xl font-bold mb-2">{sub.subName}</h2>
                        <p className="text-lg text-gray-700 mb-4">{sub.subDescription}</p>
                        <h3 className="text-xl font-semibold">Services:</h3>
                        <ul className="list-disc list-inside mb-4">
                            {sub.subServices.map((service, idx) => (
                                <li key={idx}>{service}</li>
                            ))}
                        </ul>
                        <h3 className="text-xl font-semibold">Cost:</h3>
                        <ul className="list-disc list-inside mb-4">
                            {sub.subCost.map((cost, idx) => (
                                <li key={idx}>
                                    {cost.type.charAt(0).toUpperCase() + cost.type.slice(1)}: ${cost.cost.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handlePurchase(sub)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Purchase
                        </button>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default SubscriptionPage;
