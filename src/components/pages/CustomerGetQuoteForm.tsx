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
import { useRouter } from 'next/navigation';



interface BuildingType {
    name: string;
}

const CustomerGetQuoteForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [quoteID, setQuoteID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [quoteInfo, setQuoteInfo] = useState<any>(null)
    const [canMoveOn, setCanMoveOn] = useState(false);
    const [canMoveBack, setCanMoveBack] = useState(true);
    const [facilityOptions, setFacilityOptions] = useState<BuildingType[]>([]);
    const [facilityType, setFacilityType] = useState<any>(null);
    const [customerInfo, setCustomerInfo] = useState<any>(null);
    const [roomOptions, setRoomOptions] = useState<any>(null);
    const [quoteRoomTypes, setQuoteRoomTypes] = useState<any>({});
    const [facilityRooms, setFacilityRooms] = useState<any>({});
    const [quoteFrequency, setQuoteFrequency] = useState<any>(null)
    const [quoteBudget, setQuoteBudget] = useState<any>(null)
    const [quotePackageOptions, setQuotePackageOptions] = useState<any>([])
    const [quotePackage, setQuotePackage] = useState<any>(null)
    const [recPackage, setRecPackage] = useState<any>(null);
    const [cost, setCost] = useState<any>(null);
    const [finalCost, setFinalCost] = useState<any>(0)
    const [quoteSqft, setQuoteSqft] = useState<any>(0);
    const [recPackageName, setRecPackageName] = useState<any>(null);
    const [hideBar, setHideBar] = useState<any>(false)

    const [steps, setSteps] = useState([
        { name: "Customer Information", canClick: true },
        { name: "Facility Type", canClick: false },
        { name: "Add Rooms", canClick: false },
        { name: "Frequency", canClick: false },
        { name: "Budget", canClick: false },
        { name: "Packages", canClick: false },
        { name: "Confirm", canClick: false },
    ]);

    const router = useRouter();

    console.log(quoteRoomTypes)

    const loadData = async (customerQuoteID: any) => {
        setLoading(true)
        setQuoteID(customerQuoteID)
        const quoteDetails = await getQuoteDetails(customerQuoteID);
        //console.log("Quote details:", quoteDetails);
        const quoteCustomerInfo = quoteDetails.customerData
        setCustomerInfo(quoteCustomerInfo)
        if (quoteCustomerInfo.firstName && quoteCustomerInfo.lastName && quoteCustomerInfo.email && quoteCustomerInfo.phone && quoteCustomerInfo.company && quoteCustomerInfo.address.street && quoteCustomerInfo.address.city && quoteCustomerInfo.address.state && quoteCustomerInfo.address.postalCode && quoteCustomerInfo.address.country) {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[1].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
        }
        setQuoteInfo(quoteDetails);
        setFacilityType(quoteDetails.quoteInfo.facilityType)
        const facilityTypes = await getCBOBuildingTypes();
        setFacilityOptions(facilityTypes);
        const facilityRoomOptions = await getFacilityOptions();
        if (quoteDetails.quoteInfo.facilityType != '') {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[2].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
            setFacilityRooms(facilityRoomOptions.facility_options[quoteDetails.quoteInfo.facilityType])
            //console.log(quoteDetails.quoteInfo.roomTypes)
            setQuoteRoomTypes(quoteDetails.quoteInfo.roomTypes)
            if (quoteDetails.quoteInfo.roomTypes.length > 0) {
                setSteps(prevSteps => {
                    const updatedSteps = [...prevSteps];
                    updatedSteps[3].canClick = true;
                    //console.log(updatedSteps)
                    return updatedSteps;
                })
            }
        }
        setRoomOptions(facilityRoomOptions);
        setQuoteSqft(quoteDetails.quoteInfo.sqft)
        setQuoteFrequency(quoteDetails.quoteInfo.frequency)
        if (quoteDetails.quoteInfo.frequency != '') {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[4].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
        }
        const budget = quoteDetails.quoteInfo.budget
        if (budget && budget != 0) {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[5].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
        }
        setQuoteBudget(budget)
        
        const baseCost = quoteDetails.costInfo.baseCost
        setCost(baseCost)
        const quoteFinalCost = quoteDetails.costInfo.finalCost
        setFinalCost(quoteFinalCost)
        if (quoteDetails.quoteInfo.roomTypes.length > 0) {

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
        if (quoteDetails.Package) {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[6].canClick = true;
                console.log(updatedSteps)
                return updatedSteps;
            })
        }
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

    const handleCanClick = (step: number, canClick: boolean) => {
        setSteps(prevSteps => {
            const updatedSteps = [...prevSteps];
            
            // If canClick is false, disable the current step and all subsequent steps
            if (!canClick) {
                for (let i = step; i < updatedSteps.length; i++) {
                    updatedSteps[i].canClick = false;
                }
            } else {
                // If canClick is true, only enable the current step
                updatedSteps[step].canClick = true;
            }
            
            console.log(updatedSteps); // Log to see the updated state
            return updatedSteps;
        });
    };




    const handleSetCustomerInfo = (newInfo: any) => {
        setCustomerInfo(newInfo);
    }

    const handleChangeSqft = (newSqft: any) => {
        setQuoteSqft(newSqft);
    }

    const handleSetFacilityType = (newInfo: any) => {

        setFacilityType(newInfo);
        
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

    const handleChangeRoomTypes = async (newInfo: any) => {
        console.log(newInfo)
        setQuoteRoomTypes(newInfo);
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

    const handleUpdateCost = (newCost: any) => {
        setFinalCost(newCost)
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
            case 1: return <CustomerInfo onCanClick={handleCanClick} quoteID={quoteID} customerDetails={customerInfo} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetCustomerInfo} />;
            case 2: return <Quote onCanClick={handleCanClick} quoteID={quoteID} facilityOptions={facilityOptions} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetFacilityType} />;
            case 3: return <CustomerAddRooms onCanClick={handleCanClick} quoteID={quoteID} quoteRoomTypes={quoteRoomTypes} onChangeRoomTypes={handleChangeRoomTypes} facilityRooms={facilityRooms} facilityType={facilityType} onChangeSqft={handleChangeSqft} onNextStep={handleNextStep} onMoveOn={handleMoveOn} quoteSqft={quoteSqft} />;
            case 4: return <UpdateQuoteFrequency onCanClick={handleCanClick} quoteID={quoteID} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeFrequency={handleChangeFrequency} quoteFrequency={quoteFrequency} />;
            case 5: return <UpdateQuoteBudget onCanClick={handleCanClick} quoteID={quoteID} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeBudget={handleChangeBudget} quoteBudget={quoteBudget} />;
            case 6: return <Packages onCanClick={handleCanClick} quoteID={quoteID} onUpdateCost={handleUpdateCost} onHideBar={handleHideBar} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onMoveBack={handleMoveBack} onChangePackage={handleChangePackage} quotePackage={quotePackage} quotePackageOptions={quotePackageOptions} cost={cost} recPackage={recPackage} />;
            case 7: return <ConfirmPage quoteID={quoteID} roomTypes={quoteRoomTypes} customerDetails={customerInfo} quoteBudget={quoteBudget} quoteFrequency={quoteFrequency} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onMoveBack={handleMoveBack} quotePackage={quotePackage} cost={finalCost} sqft={quoteSqft} />;
            default: return null;
        }
    };

    const handleGoBack = () => {
        setStep(Math.max(step - 1, 1))
        setCanMoveOn(true)
    }

    const handleStepClick = (clickedStep: number) => {
        setStep(clickedStep); // Set the clicked step as the current step
    };

    

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
                <QuoteProgressBar
                    stepNumber={step}
                    steps={steps} // Pass only the names
                    onStepClick={handleStepClick}
                />
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

                {step < steps.length && (
                    canMoveOn && (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 rounded-md bg-[#001F54] text-white font-semibold hover:bg-blue-800 transition"
                        >
                            Next
                        </button>
                    )
                )}

            </div>
        </div>

    );
};

export default CustomerGetQuoteForm;
