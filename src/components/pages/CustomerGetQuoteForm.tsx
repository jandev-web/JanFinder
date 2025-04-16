'use client';

import React, { useState, useEffect } from 'react';

import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';
import CustomerInfo from "@/components/pages/CustomerInfo";
import { startQuote } from '@/utils/startQuote';
import Quote from './Quote';
import ConfirmPage from '@/components/pages/ConfirmQuote';
import QuoteProgressBar from '@/components/QuoteProgressBar';
import LoadingSpinner from '@/components/loadingScreen';
import getQuoteDetails from '@/utils/getQuoteDetails';

const steps = [
    "Customer Information",
    "Facility Type",
    "Facility Information",
    "Add Rooms",
    "Selected Rooms",
    "Cleaning Frequency",
    "Get Cost",
    "Select Package"
];

interface BuildingType {
    name: string;
  }

const CustomerGetQuoteForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [quoteID, setQuoteID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [quoteInfo, setQuoteInfo] = useState<any>(null)
    const [isFinished, setIsFinished] = useState(false)
    const [canMoveOn, setCanMoveOn] = useState(false);
    const [facilityOptions, setFacilityOptions] = useState<BuildingType[]>([]);
    const [facilityType, setFacilityType] = useState<any>(null);
    const [customerInfo, setCustomerInfo] = useState<any>(null)

    useEffect(() => {
        const fetchQuote = async () => {
            if (typeof window !== "undefined") {
                const storedQuoteID = sessionStorage.getItem('customerData');
                console.log("Stored Quote ID:", storedQuoteID);
                if (storedQuoteID) {
                    setQuoteID(storedQuoteID);
                    try {
                        const quoteDetails = await getQuoteDetails(storedQuoteID);
                        console.log("Quote details:", quoteDetails);
                        setCustomerInfo(quoteDetails.customerData)
                        setQuoteInfo(quoteDetails);
                        setFacilityType(quoteDetails.facilityType)
                        const facilityTypes = await getCBOBuildingTypes();
                        setFacilityOptions(facilityTypes);

                    } catch (error) {
                        console.error("Error fetching quote details:", error);
                    }
                }
            }
            setLoading(false);
        };
        fetchQuote();
    }, []);


    const handleLoading = () => {
        setLoading(true);
    }

    const handleSetStepOne = () => {
        setStep(1);
    }

    const handleSetCustomerInfo = (newInfo: any) => {
        setCustomerInfo(newInfo);
    }

    const handleSetFacilityType = (newInfo: any) => {
        setFacilityType(newInfo);
    }

    const handleMoveOn = (moveOn: boolean) => {
        setCanMoveOn(moveOn);
    }

    const handleNextStep = (stepNumber: number) => {
        const newStep = stepNumber + 1;
        setStep(newStep);
    }



    const startNewQuote = async () => {
        setLoading(true)
        const result = await startQuote();
        console.log(result.quoteID)
        sessionStorage.setItem('customerData', result.quoteID);
        setQuoteID(result.quoteID);
        const quoteDetails = await getQuoteDetails(result.quoteID);
        console.log("Quote details:", quoteDetails);
        setQuoteInfo(quoteDetails);
        setCustomerInfo(quoteDetails.customerData)
        setLoading(false)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }




    const renderStepComponent = () => {
        switch (step) {
            case 1: return <CustomerInfo quoteID={quoteID} customerDetails={customerInfo} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetCustomerInfo}/>;
            case 2: return <Quote quoteID={quoteID} facilityOptions={facilityOptions} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetCustomerInfo}/>;
            default: return null;
        }
    };

    if (isFinished) {
        return (
            <div>
                <ConfirmPage />
            </div>
        )
    }

    if (!quoteID && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
                <p>No quote found. Please start a new quote.</p>
                <button onClick={startNewQuote}>Start New Quote</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <QuoteProgressBar stepNumber={1} />
            <div>
                {renderStepComponent()}
            </div>

            <div className="mt-8 text-center">
                {step > 1 && (
                    <button
                        onClick={() => setStep(Math.max(step - 1, 1))}
                        className="px-6 py-2 rounded-md bg-yellow-500 text-white font-semibold mr-2 hover:bg-yellow-600 transition"
                        disabled={step === 1}
                    >
                        Previous
                    </button>
                )}

                {step < steps.length ? (
                    canMoveOn && (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        >
                            Next
                        </button>
                    )
                ) : (
                    <button
                        onClick={() => setIsFinished(true)}
                        className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Finish
                    </button>
                )}

            </div>
        </div>

    );
};

export default CustomerGetQuoteForm;
