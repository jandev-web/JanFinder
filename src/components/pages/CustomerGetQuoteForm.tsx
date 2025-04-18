'use client';

import React, { useState, useEffect } from 'react';
import { getFacilityOptions } from '@/utils/getFacilityOptions';
import UpdateQuoteFrequency from "@/components/UpdateQuoteFrequency";
import UpdateQuoteBudget from "@/components/UpdateQuoteBudget";
import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';
import CustomerInfo from "@/components/pages/CustomerInfo";
import { startQuote } from '@/utils/startQuote';
import Quote from './Quote';
import ConfirmPage from '@/components/pages/ConfirmQuote';
import QuoteProgressBar from '@/components/QuoteProgressBar';
import LoadingSpinner from '@/components/loadingScreen';
import getQuoteDetails from '@/utils/getQuoteDetails';
import CustomerAddRooms from './CustomerAddRoomsPage';
import Packages from "@/components/pages/Packages";
import getPackageRecs from '@/utils/getPackageRecs';
import recPackageUtil from '@/utils/recPackageUtil'
import { calculateUpdateCost } from '@/utils/calculateUpdateCost';

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
    const [canMoveBack, setCanMoveBack] = useState(true);
    const [facilityOptions, setFacilityOptions] = useState<BuildingType[]>([]);
    const [facilityType, setFacilityType] = useState<any>(null);
    const [customerInfo, setCustomerInfo] = useState<any>(null);
    const [roomOptions, setRoomOptions] = useState<any>(null);
    const [quoteRooms, setQuoteRooms] = useState<any>(null);
    const [facilityRooms, setFacilityRooms] = useState<any>({});
    const [quoteFrequency, setQuoteFrequency] = useState<any>(null)
    const [quoteBudget, setQuoteBudget] = useState<any>(null)
    const [quotePackageOptions, setQuotePackageOptions] = useState<any>([])
    const [quotePackage, setQuotePackage] = useState<any>(null)
    const [recPackage, setRecPackage] = useState<any>(null);
    const [cost, setCost] = useState<any>(null);
    const [recPackageName, setRecPackageName] = useState<any>(null);
    const [hideBar, setHideBar] = useState<any>(false)

    const loadData = async (customerQuoteID: any) => {
        setLoading(true)
        setQuoteID(customerQuoteID)
        const quoteDetails = await getQuoteDetails(customerQuoteID);
        console.log("Quote details:", quoteDetails);
        setCustomerInfo(quoteDetails.customerData)
        setQuoteInfo(quoteDetails);
        setFacilityType(quoteDetails.quoteInfo.facilityType)
        const facilityTypes = await getCBOBuildingTypes();
        setFacilityOptions(facilityTypes);
        const facilityRoomOptions = await getFacilityOptions();
        if (quoteDetails.quoteInfo.facilityType != '') {
            setFacilityRooms(facilityRoomOptions.facility_options[quoteDetails.quoteInfo.facilityType])
        }
        setRoomOptions(facilityRoomOptions);
        setQuoteFrequency(quoteDetails.quoteInfo.frequency)
        const budget = quoteDetails.quoteInfo.budget
        setQuoteBudget(budget)
        const currentRooms = quoteDetails.quoteInfo.selectedRooms

        setQuoteRooms(currentRooms)
        const baseCost = quoteDetails.costInfo.baseCost
        setCost(baseCost)
        if (currentRooms.length > 0) {

            const packageInfo = await getPackageRecs(customerQuoteID);
            setQuotePackageOptions(packageInfo)
            if (baseCost && budget) {
                const newRecPackageName = recPackageUtil(baseCost, budget)
                setRecPackageName(newRecPackageName)
                console.log(newRecPackageName)
                console.log(packageInfo)
                const newRecPackage = packageInfo.find((pkg: any) => pkg.name === newRecPackageName);
                console.log(newRecPackage)
                setRecPackage(newRecPackage);
            }
        }
        setQuotePackage(quoteDetails.Package)
        setLoading(false)
    }

    useEffect(() => {
        const fetchQuote = async () => {
            if (typeof window !== "undefined") {
                const storedQuoteID = sessionStorage.getItem('customerData');

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
        console.log()
        setFacilityRooms(roomOptions.facility_options[newInfo]);
    }

    const handleMoveOn = (moveOn: boolean) => {
        setCanMoveOn(moveOn);
    }

    const handleMoveBack = (moveBack: boolean) => {
        setCanMoveBack(moveBack);
    }

    const handleNextStep = (stepNumber: number) => {
        const newStep = stepNumber + 1;
        setStep(newStep);
    }

    const handleChangeRooms = async (newInfo: any) => {
        setQuoteRooms(newInfo);
        if (newInfo.length > 0) {
            const packageInfo = await getPackageRecs(quoteID);
            setQuotePackageOptions(packageInfo)
            if (cost && quoteBudget) {
                const newRecPackageName = recPackageUtil(cost, quoteBudget)
                setRecPackageName(newRecPackageName)
                const newRecPackage = packageInfo.find((pkg: any) => pkg.name === recPackageName);
                setRecPackage(newRecPackage);
            }
            if (quoteFrequency) {
                calculateUpdateCost(quoteID, quoteFrequency)
            }
        }
    }

    const handleChangeFrequency = (newInfo: any, newCost: any) => {

        setQuoteFrequency(newInfo);
        setCost(newCost);
    }

    const handleChangeBudget = (newInfo: any) => {
        setQuoteBudget(newInfo);
        console.log('NewInfo: ', newInfo)
        const newRecPackageName = recPackageUtil(cost, newInfo)
        console.log(newRecPackageName)
        setRecPackageName(newRecPackageName)
        const newRecPackage = quotePackageOptions.find((pkg: any) => pkg.name === newRecPackageName);
        console.log(newRecPackage)
        setRecPackage(newRecPackage);
    }

    const handleChangePackage = (newInfo: any) => {
        setQuotePackage(newInfo);
    }

    const handleHideBar = (hideBar: boolean) => {
        setHideBar(hideBar)
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
            case 3: return <CustomerAddRooms quoteID={quoteID} facilityRooms={facilityRooms} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeRooms={handleChangeRooms} quoteRooms={quoteRooms} />;
            case 4: return <UpdateQuoteFrequency quoteID={quoteID} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeFrequency={handleChangeFrequency} quoteFrequency={quoteFrequency} />;
            case 5: return <UpdateQuoteBudget quoteID={quoteID} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeBudget={handleChangeBudget} quoteBudget={quoteBudget} />;
            case 6: return <Packages quoteID={quoteID} onHideBar={handleHideBar} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onMoveBack={handleMoveBack} onChangePackage={handleChangePackage} quotePackage={quotePackage} quotePackageOptions={quotePackageOptions} cost={cost} recPackage={recPackage} />;

            default: return null;
        }
    };

    const handleGoBack = () => {
        setStep(Math.max(step - 1, 1))
        setCanMoveOn(true)
    }

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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-32 py-12 px-4">
            {!hideBar && (
                <QuoteProgressBar stepNumber={1} />
            )}
            <div>
                {renderStepComponent()}
            </div>

            <div className="mt-8 text-center">
                {(step > 1 && canMoveBack) && (
                    <button
                        onClick={handleGoBack}
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
