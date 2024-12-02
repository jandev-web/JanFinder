import React, { useEffect, useState } from "react";
import Link from "next/link";
import getSubscription from "@/utils/getSubscription";

interface CBOSubscriptionProps {
  user: any;
}

const CBOSubscription: React.FC<CBOSubscriptionProps> = ({ user }) => {
  const [subscription, setSubscription] = useState<any | null>(null); // Initial state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (user?.sub) {
          const result = await getSubscription(user?.sub);
          setSubscription(result);
        } else {
          setSubscription("noSubscription");
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setSubscription("noSubscription");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-gray-500">Loading...</h1>
      </div>
    );
  }

  if (subscription === "noSubscription") {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-red-500">No Subscription</h1>
        <p className="text-lg mt-2">You are not currently subscribed to any plan.</p>
        <Link href="/members/subscribe">
          <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">
            Subscribe Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-500">
        {subscription.subName} ({subscription.subLevel.toUpperCase()})
      </h1>
      <p className="text-lg mt-2">Type: {subscription.subType.toUpperCase()}</p>
      <p className="text-lg mt-2">Cost: {subscription.subCost}</p>
      <h2 className="text-xl font-semibold mt-4">Services:</h2>
      <ul className="list-disc list-inside mt-2">
        {subscription.subServices.map((service: string, index: number) => (
          <li key={index}>{service}</li>
        ))}
      </ul>
    </div>
  );
};

export default CBOSubscription;
