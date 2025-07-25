'use client';

import React, { useState, useEffect } from 'react';
import CustomerAddRoomForm from '@/components/CustomerAddRoomForm';
import LoadingSpinner from '@/components/loadingScreen';
import { manualAddRoom } from '@/utils/manualAddRoom';


interface QuoteFormProps {
    quoteID: any;
    facilityType: any;
    facilityRooms: any;
    
    quoteSqft: any
    onChangeSqft: (newSqft: any) => void;
    onChangeRoomTypes: (newRoomTypes: any) => void;
    quoteRoomTypes: any;
    onNextStep: (stepNumber: number) => void;
    onMoveOn: (moveOn: boolean) => void;
    
    onCanClick: (step: any, canClick: boolean) => void;
}

const CustomerAddRooms: React.FC<QuoteFormProps> = ({ onCanClick, quoteID, quoteRoomTypes, onChangeRoomTypes, quoteSqft, facilityType, facilityRooms, onChangeSqft, onNextStep, onMoveOn }) => {

    const [roomTypes, setRoomTypes] = useState<any>(quoteRoomTypes || [])
    const [showAddRoomForm, setShowAddRoomForm] = useState(false);
    const [sqft, setSqft] = useState(quoteSqft || 0)
    const [loading, setLoading] = useState(false);
    const [hasChanged, setHasChanged] = useState(false)
    const [listLoading, setListLoading] = useState(false);
    console.log(facilityRooms)
    useEffect(() => {
            if (!roomTypes || roomTypes.length === 0 || hasChanged) {
                console.log('Setting onMove false')
                setShowAddRoomForm(true);
                onMoveOn(false);
            }
    }, [roomTypes]);

    const handleChangeSqft = (newSqft: any) => {
        setSqft(newSqft);
        onChangeSqft(newSqft)
    }

    const handleUpdateForm = async (formInfo: any) => {
        await manualAddRoom(quoteID, formInfo);
        handleChangeSqft(formInfo.sqft)
        setRoomTypes(formInfo.roomTypes);
          
        onChangeRoomTypes(formInfo.roomTypes);
        setHasChanged(true)
        onMoveOn(true)
        setListLoading(false)
    };

    const handleSubmit = async (data: any) => {
        setLoading(true)
        handleUpdateForm(data)
        onNextStep(4)
        onCanClick(4, true)
      };


    const onExit = () => {
        setShowAddRoomForm(false);
    };

    

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!quoteID) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <LoadingSpinner />
                <p className="text-white mt-4">No quote found, please start the process again.</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col'>
            <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>3</span>: Room Information</h1>
                <p className="text-xl">
                    Please add the rooms in your {facilityType} facility, along with some important information for each room.
                </p>
            </div>
            {showAddRoomForm ? (
                <CustomerAddRoomForm onSubmit={handleSubmit} onExit={onExit} roomTypeOptions={facilityRooms} roomTypes={roomTypes} />
            ) : (
                <button onClick={() => setShowAddRoomForm(true)} className="self-center bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 mb-8">
                    Add Room
                </button>
            )}

            {((roomTypes.length > 0) && hasChanged) &&
                <button onClick={handleSubmit} className="self-center bg-green-600 hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 mt-8">
                    Confirm Room Information
                </button>
            }

        </div>
    );
};

export default CustomerAddRooms;
