'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loadingScreen";
const ConfirmationPage: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [quoteInfo, setQuoteInfo] = useState<any>(null);
  const router = useRouter();

  // Fetch initial quote details
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        if (typeof window !== "undefined") {
          const storedQuoteID = sessionStorage.getItem("customerData");
          if (!storedQuoteID) {
            console.warn("No quoteID found in sessionStorage.");
            //router.push("/get-a-quote");
            return;
          }
          sessionStorage.removeItem('customerData');

          const quoteDetails = {
            "quoteInfo": {
              "roomTypes": [
                {
                  "roomType": "string",
                  "roomCount": 0,
                  "roomPrice": 0
                }
              ],
              "quoteID": "string",
              "quoteName": "string",
              "quoteStatus": "string",
              "quotePrice": 0,
              "quoteDescription": "string",
              "quoteNotes": "string",
              "quoteDate": "string",
              "quoteExpiry": "string"
            },
            "costInfo": {
              "totalCost": 0,
              "totalCostWithTax": 0,
              "taxRate": 0,
              "deposit": 0,
              "depositDueDate": "string",
              "balanceDue": 0,
              "balanceDueDate": "string"
            },
            "Package": {
              "packageID": "string",
              "packageName": "string",
              "packageDescription": "string",
              "packagePrice": 0,
              "packageItems": [
                "string"
              ]
            },
            "customerData": {
              "customerID": "string",
              "firstName": "string",
              "lastName": "string",
              "email": "string",
              "phone": "string",
              "address": {
                "street": "string",
                "city": "string",
                "state": "string",
                "zip": "string"
              }
            },
            "Timestamp": "2024-03-27T00:00:00.000Z",
            "OwnerID": "string",
            "QuoteID": "string"
          }
          setQuoteInfo(quoteDetails);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Optionally, handle errors or redirect.
      }
    };
    fetchCustomerData();
  }, [router]);

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-12">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center">
        Congratulations {quoteInfo.customerData.firstName} {quoteInfo.customerData.lastName}, your quote has been sent out to bid!
      </h1>
      <p className="text-lg md:text-xl font-semibold mb-8 text-center max-w-lg mx-auto">
        You will receive an email shortly when one of our Cleaning Companies accepts your bid. Thank you for choosing our service!
      </p>

      {/* Button Section */}
      <button
        className="bg-yellow-500 text-gray-800 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
      >
        Click Here to Check Bid Status
      </button>

      {/* Optional: Additional Information */}
      <p className="text-sm mt-6 text-center text-gray-300">
        Need assistance? <a href="mailto:support@company.com" className="underline hover:text-yellow-300">Contact Support</a>
      </p>
    </div>

  );
};

export default ConfirmationPage;
