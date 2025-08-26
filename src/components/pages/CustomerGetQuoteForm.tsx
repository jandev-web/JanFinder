'use client';

import React, { useState, useEffect } from 'react';
import { getFacilityOptions } from '@/utils/getFacilityOptions';
import UpdateQuoteFrequency from "@/components/UpdateQuoteFrequency";
import UpdateQuoteBudget from "@/components/UpdateQuoteBudget";
import CustomerInfo from "@/components/pages/CustomerInfo";
import { startQuote } from '@/utils/startQuote';
import UpdateFacility from '../UdateQuoteFacility';
import FloorInfoPage from '@/components/pages/CustomerFloorInfoPage'
import ConfirmPage from '@/components/pages/ConfirmQuote';
import QuoteProgressBar from '@/components/QuoteProgressBar';
import LoadingSpinner from '@/components/loadingScreen';
import CustomerAddRooms from '../CustomerAddRooms';
import Packages from "@/components/pages/Packages";
import recPackageUtil from '@/utils/recPackageUtil'
import { calculateTime } from '@/utils/calculateTime'
import updateFloorInfo from '@/utils/updateFloorInfo';
import { useRouter } from 'next/navigation';
import updateQuoteRooms from '@/utils/updateQuoteRooms';
import { updatePackages } from '@/utils/updatePackages';
import updateQuoteFrequency from '@/utils/updateQuoteFrequency';
import getQuoteDetailsClient from '@/utils/getQuoteDetailsClient';



const CustomerGetQuoteForm: React.FC = ({
}) => {
    const [step, setStep] = useState<number>(1);
    const [quoteID, setQuoteID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [canMoveOn, setCanMoveOn] = useState(false);
    const [canMoveBack, setCanMoveBack] = useState(true);
    const [facilityOptions, setFacilityOptions] = useState<any>([]);
    const [facilityType, setFacilityType] = useState<any>(null);
    const [floorNumber, setFloorNumber] = useState<any>(null);
    const [stairwells, setStairwells] = useState<any>(null)
    const [customerInfo, setCustomerInfo] = useState<any>(null);
    const [roomOptions, setRoomOptions] = useState<any>(null);
    const [quoteRoomTypes, setQuoteRoomTypes] = useState<any>([]);
    const [facilityRooms, setFacilityRooms] = useState<any>({});
    const [quoteFrequency, setQuoteFrequency] = useState<any>(null)
    const [quoteBudget, setQuoteBudget] = useState<any>(0)
    const [quotePackageOptions, setQuotePackageOptions] = useState<any>([])
    const [quotePackage, setQuotePackage] = useState<any>(null)
    const [recPackage, setRecPackage] = useState<any>(null);
    const [finalCost, setFinalCost] = useState<any>(0)
    const [quoteSqft, setQuoteSqft] = useState<any>(0);
    const [quoteFloorTypes, setQuoteFloorTypes] = useState<any>({
        carpet: 0,
        hardfloor: 0
    })
    const [hideBar, setHideBar] = useState<any>(false)

    const [steps, setSteps] = useState([
        { name: "Customer Information", canClick: true },
        { name: "Budget", canClick: false },
        { name: "Facility Type", canClick: false },
        { name: "Number of Floors", canClick: false },
        { name: "Add Rooms", canClick: false },
        { name: "Frequency", canClick: false },
        { name: "Packages", canClick: false },
        { name: "Confirm", canClick: false },
    ]);

    const router = useRouter();



    const loadData = async (customerQuoteID: any) => {
        setLoading(true)
        setQuoteID(customerQuoteID)
        const quoteDetails = await getQuoteDetailsClient(customerQuoteID);
        console.log("Quote details:", quoteDetails);
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

        const budget = quoteDetails.quoteInfo.budget
        if (budget && budget != 0) {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[2].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
        }
        setQuoteBudget(budget)
        const facilityRoomOptions: any = await getFacilityOptions();
        setRoomOptions(facilityRoomOptions);
        setFacilityOptions(Object.keys(facilityRoomOptions));
        if (quoteDetails.quoteInfo.facilityType != '') {
            setFacilityRooms(facilityRoomOptions[quoteDetails.quoteInfo.facilityType])
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[3].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
        }
        setFacilityType(quoteDetails.quoteInfo.facilityType)
        //console.log(facilityRoomOptions.facility_options) 
        //console.log(quoteDetails.quoteInfo.floors)
        if (quoteDetails.quoteInfo.floors != 0) {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[4].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
        }
        setStairwells(quoteDetails.quoteInfo.stairwells)
        setFloorNumber(quoteDetails.quoteInfo.floors)

        if (quoteDetails.quoteInfo.roomTypes.length > 0) {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[5].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
        }
        setQuoteRoomTypes(quoteDetails.quoteInfo.roomTypes)
        setQuoteFloorTypes(quoteDetails.quoteInfo.floorTypes)
        setQuoteSqft(quoteDetails.quoteInfo.sqft)

        setQuoteFrequency(quoteDetails.quoteInfo.frequency)

        const packageInfo = quoteDetails.Package
        //console.log(packageInfo)
        if (quoteDetails.quoteInfo.frequency != '') {
            setQuotePackageOptions(packageInfo.packageOptions)
            console.log(packageInfo.packageOptions)
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[6].canClick = true;
                //console.log(updatedSteps)
                return updatedSteps;
            })
            const newRecPackageType = recPackageUtil(packageInfo.packageOptions, budget)
            const newRecPackage = packageInfo.packageOptions.find((pkg: any) => pkg.packageType === newRecPackageType);
            console.log("recPackage", newRecPackage)

            setRecPackage(newRecPackage);
        }
        setQuotePackage(packageInfo.packageChoice)
        if (packageInfo.packageChoice) {
            setSteps(prevSteps => {
                const updatedSteps = [...prevSteps];
                updatedSteps[7].canClick = true;

                return updatedSteps;
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        (async () => {


            // Fallback: existing session
            const stored = typeof window !== 'undefined'
                ? sessionStorage.getItem('customerData')
                : null;

            if (stored) {
                await loadData(stored);
                return;
            }

            // Nothing to load
            setLoading(false);
        })();
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


            return updatedSteps;
        });
    };




    const handleSetCustomerInfo = (newInfo: any) => {
        setCustomerInfo(newInfo);
    }

    const handleSetFacilityType = async (newInfo: any) => {
        setFacilityType(newInfo);
        setFacilityRooms(roomOptions[newInfo]);
        if (floorNumber && floorNumber != 0) {
            handleCanClick(5, false)
            const newFloorInfo = {
                floors: 0,
                stairwells: {
                    carpet: 0,
                    hardfloor: 0
                }
            }
            setStairwells({
                carpet: 0,
                hardfloor: 0
            });
            setFloorNumber(0);
            await updateFloorInfo(quoteID, newFloorInfo);
        }
        if (quoteRoomTypes.length > 0) {
            setQuoteRoomTypes([])
            setQuoteFloorTypes({
                carpet: 0,
                hardfloor: 0
            })

            setQuoteSqft(0)
            const formInfo = {
                sqft: 0,
                roomTypes: [],
                floorTypes: {
                    hardfloor: 0,
                    carpet: 0
                }
            }
            await updateQuoteRooms(quoteID, formInfo);
        }
        if (quoteFrequency && quoteFrequency != '') {
            setQuoteFrequency('')
            setQuotePackageOptions([])
            setQuotePackage(null)
            setRecPackage(null)
            await updateQuoteFrequency(quoteID, '');
            const newPackage = {
                packageChoice: null,
                packageOptions: {
                    packageOne: null,
                    packageTwo: null,
                    packageThree: null
                }
            }
            await updatePackages(quoteID, newPackage)
        }

    }


    const handleFloorInfo = async (newFloorNumber: any, newStairwells: any) => {
        setStairwells(newStairwells);
        setFloorNumber(newFloorNumber);
        if (quoteRoomTypes.length > 0 && quoteFrequency && quoteFrequency != '') {
            const newPackage = {
                packageChoice: null,
                packageOptions: {
                    packageOne: null,
                    packageTwo: null,
                    packageThree: null
                }
            }
            setQuotePackage(null)
            await updatePackages(quoteID, newPackage)

            const calculatedPackages = await calculateTime(quoteID)
            setQuotePackageOptions(calculatedPackages.packageOptions);
            if (quoteBudget) {
                const newRecPackageType = recPackageUtil(calculatedPackages.packageOptions, quoteBudget)
                console.log(newRecPackageType)
                const newRecPackage = quotePackageOptions.find((pkg: any) => pkg.name === newRecPackageType);
                setRecPackage(newRecPackage);
            }
        }

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

    const handleChangeRoomTypes = async (newRoomTypes: any, newSqft: any) => {
        setQuoteSqft(newSqft);
        setQuoteRoomTypes(newRoomTypes);
        if (newRoomTypes.length > 0 && quoteFrequency && quoteFrequency != '') {
            const newPackage = {
                packageChoice: null,
                packageOptions: {
                    packageOne: null,
                    packageTwo: null,
                    packageThree: null
                }
            }
            setQuotePackage(null)
            await updatePackages(quoteID, newPackage)
            const calculatedPackages = await calculateTime(quoteID)
            setQuotePackageOptions(calculatedPackages.packageOptions);
            if (quoteBudget) {
                const newRecPackageType = recPackageUtil(calculatedPackages.packageOptions, quoteBudget)
                console.log(newRecPackageType)
                const newRecPackage = quotePackageOptions.find((pkg: any) => pkg.name === newRecPackageType);
                console.log("recPackage", newRecPackage)
                setRecPackage(newRecPackage);
            }
        }

    }

    const handleUpdateCost = (newCost: any) => {
        setFinalCost(newCost)
    }

    const handleChangeFrequency = async (newInfo: any) => {
        console.log(newInfo)

        const newPackage = {
            packageChoice: null,
            packageOptions: {
                packageOne: null,
                packageTwo: null,
                packageThree: null
            }
        }
        setQuotePackage(null)
        await updatePackages(quoteID, newPackage)
        const calculatedPackages = await calculateTime(quoteID)
        console.log(calculatedPackages)
        setQuoteFrequency(newInfo);
        console.log(calculatedPackages)
        setQuotePackageOptions(calculatedPackages.packageOptions);
        if (quoteBudget) {
            const newRecPackageType = recPackageUtil(calculatedPackages.packageOptions, quoteBudget)
            console.log(newRecPackageType)
            const newRecPackage = quotePackageOptions.find((pkg: any) => pkg.packageType === newRecPackageType);
            setRecPackage(newRecPackage);
        }
    }

    const handleChangeBudget = (newInfo: any) => {
        setQuoteBudget(newInfo);
        if (quotePackageOptions.length > 0) {
            const newRecPackageType = recPackageUtil(quotePackageOptions, newInfo)
            console.log(newRecPackageType)
            const newRecPackage = quotePackageOptions.find((pkg: any) => pkg.name === newRecPackageType);
            setRecPackage(newRecPackage);
        }
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
            case 1:
                return <CustomerInfo onCanClick={handleCanClick} quoteID={quoteID} customerDetails={customerInfo} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetCustomerInfo} />;
            case 2:
                return <UpdateQuoteBudget onCanClick={handleCanClick} quoteID={quoteID} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeBudget={handleChangeBudget} quoteBudget={quoteBudget} />;
            case 3:
                return <UpdateFacility onCanClick={handleCanClick} quoteID={quoteID} facilityOptions={facilityOptions} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeInfo={handleSetFacilityType} />;
            case 4:
                return <FloorInfoPage onCanClick={handleCanClick} quoteID={quoteID} floorNumber={floorNumber} stairwells={stairwells} onChangeFloors={handleFloorInfo} onNextStep={handleNextStep} onMoveOn={handleMoveOn} />;
            case 5:
                return <CustomerAddRooms onCanClick={handleCanClick} quoteID={quoteID} quoteRoomTypes={quoteRoomTypes} onChangeRoomTypes={handleChangeRoomTypes} facilityRooms={facilityRooms} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} quoteSqft={quoteSqft} quoteFloorTypes={quoteFloorTypes} />;
            case 6:
                return <UpdateQuoteFrequency onCanClick={handleCanClick} quoteID={quoteID} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onChangeFrequency={handleChangeFrequency} quoteFrequency={quoteFrequency} />;
            case 7:
                return <Packages onCanClick={handleCanClick} quoteID={quoteID} onUpdateCost={handleUpdateCost} onHideBar={handleHideBar} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onMoveBack={handleMoveBack} onChangePackage={handleChangePackage} quotePackage={quotePackage} quotePackageOptions={quotePackageOptions} recPackage={recPackage} />;
            case 8:
                return <ConfirmPage quoteID={quoteID} roomTypes={quoteRoomTypes} customerDetails={customerInfo} quoteBudget={quoteBudget} quoteFrequency={quoteFrequency} facilityType={facilityType} onNextStep={handleNextStep} onMoveOn={handleMoveOn} onMoveBack={handleMoveBack} quotePackage={quotePackage} cost={finalCost} sqft={quoteSqft} />;
            default:
                return null;
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
