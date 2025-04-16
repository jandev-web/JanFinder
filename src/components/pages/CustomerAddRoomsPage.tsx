'use client';

import React, { useState, useEffect } from 'react';
import CustomerAddRoomForm, { Room } from '@/components/CustomerAddRoomForm';
import { manualDeleteRoom } from '@/utils/manualDeleteRoom';
import LoadingSpinner from '@/components/loadingScreen';
import { manualAddRoom } from '@/utils/manualAddRoom';
import CustomerRoomsList from '../CustomerRoomsList';

interface QuoteFormProps {
    quoteID: any;
    facilityType: any;
    facilityRooms: any;
    quoteRooms: any;
    onNextStep: (stepNumber: number) => void;
    onMoveOn: (moveOn: boolean) => void;
    onChangeRooms: (facilityRoom: any) => void;
}

const CustomerAddRooms: React.FC<QuoteFormProps> = ({ quoteID, facilityType, quoteRooms, facilityRooms, onNextStep, onMoveOn, onChangeRooms }) => {

    const [rooms, setRooms] = useState<any>(quoteRooms || []);
    const [showAddRoomForm, setShowAddRoomForm] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [hasChanged, setHasChanged] = useState(false)
    const [listLoading, setListLoading] = useState(false);

    console.log("quoteRooms", quoteRooms)

    useEffect(() => {
            if (!rooms || rooms.length === 0 || hasChanged) {
                setShowAddRoomForm(true);
                onMoveOn(false);
            }
    }, [rooms]);

    const handleAddRoom = async (newRoom: Room) => {
        setListLoading(true)
        await manualAddRoom(quoteID, newRoom);
        setRooms((prevRooms: any) => [...prevRooms, newRoom]);
        onChangeRooms((prevRooms: any) => [...prevRooms, newRoom])
        setHasChanged(true)
        onMoveOn(true)
        setListLoading(false)
    };

    const handleDeleteRoom = async (oldRoom: Room) => {
        setLoading(true)
        await manualDeleteRoom(quoteID, oldRoom);
        setRooms((prevRooms: any) => prevRooms.filter((room: any) => room !== oldRoom));
        onChangeRooms((prevRooms: any) => prevRooms.filter((room: any) => room !== oldRoom));
        if (rooms.length === 0) {
            setShowAddRoomForm(true);
            onMoveOn(false);
        }
        setHasChanged(true)
        setLoading(false)
    };

    const handleSubmit = async () => {
        setLoading(true)
        onNextStep(3)
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
                <CustomerAddRoomForm onAddRoom={handleAddRoom} onExit={onExit} roomTypeOptions={facilityRooms} rooms={rooms} />
            ) : (
                <button onClick={() => setShowAddRoomForm(true)} className="self-center bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 mb-8">
                    Add Room
                </button>
            )}

            <CustomerRoomsList rooms={rooms} onDeleteRoom={handleDeleteRoom} listLoading={listLoading}/>
            {((rooms.length > 0) && hasChanged) &&
                <button onClick={handleSubmit} className="self-center bg-green-600 hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 mt-8">
                    Confirm Room Information
                </button>
            }

        </div>
    );
};

export default CustomerAddRooms;
