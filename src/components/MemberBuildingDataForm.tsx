'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CustomerInfo from '@/components/MemberAddCustomerInfo';
import ChangeFacilityType from './MemberChangeFacilityType';
import MeasurementChoice from '@/components/MemberMeasurementChoice';
import MemberSetFrequency from './MemberSetFrequency';
import SelectedRoomsList from '@/components/MembersAddSelectRooms';
import AddFacilityDetails from './MemberAddFacilityInfo';
import MemberGetCost from './MemberGetCost';
import RestrictedQuote from './RestrictedQuote';
import getQuoteDetails from '@/utils/getQuoteDetails';
import ConfirmOwnerQuote from './ConfirmOwnerQuoteComponent';
import ChoosePackage from '@/components/MemberPickPackage'


type Building = {
    name: string;
    areas: string[];
};

interface MemberBuildingDataFormProps {
    buildingData: Building[];
    user: any;
}

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

const MemberBuildingDataForm: React.FC<MemberBuildingDataFormProps> = ({ buildingData, user }) => {
    const [step, setStep] = useState<number>(1);
    const searchParams = useSearchParams();
    const quoteID = searchParams.get('quoteID');
    const [userStatus, setUserStatus] = useState<string>('');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [userID, setUserID] = useState('')
    const handleBack = () => {
        setIsFinished(false);
    };

    useEffect(() => {
        if (user?.OwnerID) {
            setUserStatus('Owner');
            setUserID(user.OwnerID)
        } else if (user?.CBOID) {
            setUserStatus('CBO');
            setUserID(user.CBOID)
        }

        const checkAuthorization = async () => {
            if (quoteID) {
                try {
                    const quoteDetails = await getQuoteDetails(quoteID);
                    if ((userStatus === 'Owner' && quoteDetails.Owner !== user.OwnerID) ||
                        (userStatus === 'CBO' && quoteDetails.Owner !== user.CBOID)) {
                        setIsAuthorized(false);
                    }
                } catch (error) {
                    console.error('Error fetching quote details:', error);
                }
            }
        };
        checkAuthorization();
    }, [quoteID, user, userStatus]);

    if (!isAuthorized) {
        return <RestrictedQuote memberStatus={userStatus} />;
    }

    const renderStepComponent = () => {
        switch (step) {
            case 1: return <CustomerInfo quoteID={quoteID} />;
            case 2: return <ChangeFacilityType quoteID={quoteID} buildingData={buildingData} />;
            case 3: return <AddFacilityDetails quoteID={quoteID} />;
            case 4: return <MeasurementChoice quoteID={quoteID} />;
            case 5: return <SelectedRoomsList quoteID={quoteID} />;
            case 6: return <MemberSetFrequency quoteID={quoteID} />;
            case 7: return <MemberGetCost quoteID={quoteID} />;
            case 8: return <ChoosePackage quoteID={quoteID} />;
            default: return null;
        }
    };

    if (isFinished) {
        return (
            <div>
                <ConfirmOwnerQuote handleBack={handleBack} quoteID={quoteID} user={user} />
            </div>
        )
    }

    return (
        <div className="flex max-w-5xl mx-auto">
            <div className="w-1/4 p-6">
                <h2 className="text-lg font-bold text-green-700 mb-4">Contents</h2>
                <ul className="space-y-4">
                    {steps.map((stepName, index) => (
                        <li
                            key={index}
                            onClick={() => setStep(index + 1)}
                            className={`cursor-pointer px-4 py-2 rounded-lg font-semibold ${step === index + 1 ? 'bg-green-600 text-white' : 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600'}`}
                        >
                            {stepName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Building Data Form</h1>
                <p className="text-center text-lg text-yellow-600 mb-6">Step {step} of {steps.length}</p>

                <div className="bg-green-100 p-6 rounded-lg shadow-inner">
                    {renderStepComponent()}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setStep(Math.max(step - 1, 1))}
                        className="px-6 py-2 rounded-md bg-yellow-500 text-white font-semibold mr-2 hover:bg-yellow-600 transition"
                        disabled={step === 1}
                    >
                        Previous
                    </button>
                    {step < steps.length ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        >
                            Next
                        </button>
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
        </div>
    );
};

export default MemberBuildingDataForm;
