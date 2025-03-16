"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getQuoteDetails from "@/utils/getQuoteDetails";

const ConfirmationPage: React.FC = () => {
  const [quoteID, setQuoteID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteInfo, setQuoteInfo] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  
  // Choose a random duration between 20,000 and 30,000 milliseconds (20-30 seconds)
  const duration = Math.floor(Math.random() * 10000) + 20000;
  const progressIntervalRef = useRef<number | null>(null);

  // Determine a message based on the current progress
  const getProgressMessage = (progress: number) => {
    if (progress < 33) {
      return "Sending quote to bid...";
    } else if (progress < 66) {
      return "Bidding commenced...";
    } else if (progress < 100) {
      return "We have a while...";
    } else {
      return "Finalizing bid...";
    }
  };

  // Fetch initial quote details
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        if (typeof window !== "undefined") {
          const storedQuoteID = sessionStorage.getItem("customerData");
          if (!storedQuoteID) {
            console.warn("No quoteID found in sessionStorage.");
            router.push("/quote");
            return;
          }
          setQuoteID(storedQuoteID);
          const quoteDetails = await getQuoteDetails(storedQuoteID);
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

  // Poll for changes in quoteInfo fields (isAccepted and Owner)
  useEffect(() => {
    if (!quoteID) return;
    const pollInterval = setInterval(async () => {
      try {
        const details = await getQuoteDetails(quoteID);
        setQuoteInfo(details);
        console.log("Accepted:", details.IsAccepted);
        // Check if quote has been accepted
        if (details?.isAccepted === true && details?.Owner && details.Owner !== "None") {
          // Clear the progress interval if it's running
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          clearInterval(pollInterval);
          router.push("/get-a-quote/winner");
        }
      } catch (error) {
        console.error("Error polling quote details:", error);
      }
    }, 2000); // poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [quoteID, router]);

  // Progress bar animation
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-800 text-center">
        Please sit tight while you wait for the bidding process.
      </h1>
      <div className="w-full max-w-md bg-gray-300 rounded-full h-6 mb-4">
        <div
          className="bg-blue-500 h-6 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-lg font-medium text-gray-700">
        {getProgressMessage(progress)}
      </p>
    </div>
  );
};

export default ConfirmationPage;
