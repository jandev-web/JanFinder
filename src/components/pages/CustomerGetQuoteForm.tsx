'use client';

import React, { useState, useEffect } from 'react';
import { getFacilityOptions } from '@/utils/getFacilityOptions';

import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';
import CustomerInfo from "@/components/pages/CustomerInfo";
import { startQuote } from '@/utils/startQuote';
import Quote from './Quote';
import ConfirmPage from '@/components/pages/ConfirmQuote';
import QuoteProgressBar from '@/components/QuoteProgressBar';
import LoadingSpinner from '@/components/loadingScreen';
import getQuoteDetails from '@/utils/getQuoteDetails';
import CustomerAddRooms from './CustomerAddRoomsPage';
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
    const [customerInfo, setCustomerInfo] = useState<any>(null);
    const [roomOptions, setRoomOptions] = useState<any>(null);
    const [quoteRooms, setQuoteRooms] = useState<any>(null);
    const [facilityRooms, setFacilityRooms] = useState<any>({});

    const loadData = async (customerQuoteID: any) => {
        console.log('Loading Data...')
        //console.log("Customer Quote ID:", customerQuoteID);
        setLoading(true)
        setQuoteID(customerQuoteID)
        const quoteDetails = await getQuoteDetails(customerQuoteID);
        console.log("Quote details:", quoteDetails);
        setCustomerInfo(quoteDetails.customerData)
        setQuoteInfo(quoteDetails);
        setQuoteRooms(quoteDetails.quoteInfo.selectedRooms)
        setFacilityType(quoteDetails.quoteInfo.facilityType)
        const facilityTypes = await getCBOBuildingTypes();
        setFacilityOptions(facilityTypes);
        const facilityRoomOptions = await getFacilityOptions();
        console.log("facilityRooms", facilityRoomOptions)
        if (quoteDetails.quoteInfo.facilityType != '') {
            console.log("facilityType", quoteDetails.quoteInfo.facilityType)
            console.log("facilityRoomOptions", facilityRoomOptions.facility_options[quoteDetails.quoteInfo.facilityType])
            setFacilityRooms(facilityRoomOptions.facility_options[quoteDetails.quoteInfo.facilityType])
        }
        setRoomOptions(facilityRoomOptions)
        setLoading(false)
    }

    useEffect(() => {
        const fetchQuote = async () => {
            if (typeof window !== "undefined") {
                const storedQuoteID = sessionStorage.getItem('customerData');
                console.log("Stored Quote ID:", storedQuoteID);
                if (storedQuoteID) {
                    try {
                        await loadData(storedQuoteID);
                    } catch (error) {
                        console.error("Error fetching quote details:", error);
                    }
                }
            }
            setLoading(false);
        };
        fetchQuote();
    }, []);

   


    const handleSetCustomerInfo = (newInfo: any) => {
        setCustomerInfo(newInfo);
    }

    const handleSetFacilityType = (newInfo: any) => {

        setFacilityType(newInfo);
        setFacilityRooms(roomOptions.facility_options[facilityType]);
    }

    const handleMoveOn = (moveOn: boolean) => {
        setCanMoveOn(moveOn);
    }

    const handleNextStep = (stepNumber: number) => {
        const newStep = stepNumber + 1;
        setStep(newStep);
    }

    const handleChangeRooms = (newInfo: any) => {
        setQuoteRooms(newInfo);
    }



    const startNewQuote = async () => {
        setLoading(true)
        const result = await startQuote();
        sessionStorage.setItem('customerData', result.quoteID);
        loadData(result.quoteID);
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
            case 1: return <CustomerInfo quoteID={quoteID} customerDetails={customerInfo} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetCustomerInfo} />;
            case 2: return <Quote quoteID={quoteID} facilityOptions={facilityOptions} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetFacilityType} />;
            case 3: return <CustomerAddRooms quoteID={quoteID} facilityRooms={facilityRooms} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeRooms={handleChangeRooms} quoteRooms={quoteRooms}/>;

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
                            className="px-6 py-2 rounded-md bg-[#001F54] text-white font-semibold hover:bg-blue-800 transition"
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
