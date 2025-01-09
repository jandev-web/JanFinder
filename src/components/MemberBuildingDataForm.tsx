'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import QuoteDetails from '@/components/MemberStartQuoteDetails';
import CustomerInfo from '@/components/MemberAddCustomerInfo';
import ChangeFacilityType from './MemberChangeFacilityType';
import MeasurementChoice from '@/components/MemberMeasurementChoice';
import MemberSetFrequency from './MemberSetFrequency';
import SelectedRoomsList from '@/components/MembersAddSelectRooms';
import AddFacilityDetails from './MemberAddFacilityInfo';
import getQuoteDetails from '@/utils/getQuoteDetails';
import { getFacilityOptions } from '@/utils/getFacilityOptions'
import getPackageRecs from '@/utils/getPackageRecs'
import { setSelectedRooms } from '@/utils/setSelectedRooms'
import { setSqftUtil } from '@/utils/setSqft'
import MemberGetCost from './MemberGetCost';
type Room = {
    roomName: string;
    sqft: string;
    floorType: string;
    difficulty: string;
};

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
    "Get Time"
];

const MemberBuildingDataForm: React.FC<MemberBuildingDataFormProps> = ({ buildingData, user }) => {
    const [step, setStep] = useState<number>(1);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [facilityType, setFacilityType] = useState('')

    const [quoteDetails, setQuoteDetails] = useState<any>(null);
    const searchParams = useSearchParams();
    const quoteID = searchParams.get('quoteID');
    const [facilityRooms, setFacilityRooms] = useState<any>(null);
    const [measureType, setMeasureType] = useState<any>('manual')
    const [customerInfo, setCustomerInfo] = useState<any>(null);
    //console.log(buildingData[0])

    useEffect(() => {
        // Fetch quote details when the component mounts
        const fetchQuoteDetails = async () => {
            if (quoteID) {
                try {
                    const facilityAreaInfo = await getFacilityOptions()

                    console.log(facilityAreaInfo)
                    const details = await getQuoteDetails(quoteID);
                    console.log(details)
                    setCustomerInfo(details.customerData)
                    const chosenFacility = details?.quoteInfo?.facilityType
                    //console.log(chosenFacility)
                    setFacilityType(chosenFacility)
                    //console.log(chosenFacility)
                    //console.log(buildingData[1])
                    const selectFacilityInfo = buildingData.find((building) => building['name'] === chosenFacility);
                    const selectFacilityRooms = selectFacilityInfo?.areas
                    if (selectFacilityRooms) {
                        console.log("Selected Facility:", selectFacilityRooms);
                    } else {
                        console.log("No facility found with the specified name.");
                    }
                    setFacilityRooms(selectFacilityRooms)
                    console.log(selectFacilityRooms)
                    setQuoteDetails(details);
                    //console.log('Quote Details:', details);
                } catch (error) {
                    console.error("Failed to fetch quote details:", error);
                }
            }
        };
        fetchQuoteDetails();
    }, [quoteID, buildingData]);


    const handleFacilityInfo = (name: string, email: string, address: string, phone: string) => {
        setCustomerInfo({ name, email, address, phone });
        setStep(2);
    };



    const renderStepComponent = () => {
        switch (step) {

            case 1:
                return (
                    <CustomerInfo
                        onNext={handleFacilityInfo}
                        quoteID={quoteID}
                    />
                );
            case 2:
                return (
                    <ChangeFacilityType
                        quoteID={quoteID}
                        buildingData={buildingData}
                    />
                );
            case 3:
                return (
                    <AddFacilityDetails
                        onNext={handleFacilityInfo}
                        quoteID={quoteID}
                    />
                );

            case 4:
                return <MeasurementChoice quoteID={quoteID} />;
            case 5:
                return <SelectedRoomsList quoteID={quoteID} />;
            case 6:
                return <MemberSetFrequency quoteID={quoteID} />;
            case 7:
                return <MemberGetCost quoteID={quoteID} />
            default:
                return null;
        }
    };

    return (
        <div className="flex max-w-5xl mx-auto">
            {/* Sidebar with steps */}
            <div className="w-1/4 p-6">
                <h2 className="text-lg font-bold text-green-700 mb-4">Contents</h2>
                <ul className="space-y-4">
                    {steps.map((stepName, index) => (
                        <li
                            key={index}
                            onClick={() => setStep(index + 1)}
                            className={`cursor-pointer px-4 py-2 rounded-lg font-semibold ${step === index + 1 ? 'bg-green-600 text-white' : 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600'
                                }`}
                        >
                            {stepName}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Form content */}
            <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Building Data Form</h1>
                <p className="text-center text-lg text-gold-600 mb-6">Step {step} of 7</p>

                <div className="bg-green-100 p-6 rounded-lg shadow-inner">
                    {renderStepComponent()}
                </div>

                {/* Navigation buttons */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setStep(Math.max(step - 1, 1))}
                        className="px-6 py-2 rounded-md bg-gold-500 text-white font-semibold mr-2 hover:bg-gold-600 transition"
                        disabled={step === 1}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setStep(Math.min(step + 1, steps.length))}
                        className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        disabled={step === steps.length}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberBuildingDataForm;
