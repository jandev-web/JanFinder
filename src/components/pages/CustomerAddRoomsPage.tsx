'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomerAddRoomForm, { Room } from '@/components/CustomerAddRoomForm';
import { manualDeleteRoom } from '@/utils/manualDeleteRoom';
import getQuoteDetails from '@/utils/getQuoteDetails';
import { getFacilityOptions } from '@/utils/getFacilityOptions';
import LoadingSpinner from '@/components/loadingScreen';
import { manualAddRoom } from '@/utils/manualAddRoom';
import QuoteProgressBar from '../QuoteProgressBar';
import CustomerRoomsList from '../CustomerRoomsList';

const CustomerAddRooms: React.FC = () => {
    const [facilityRooms, setFacilityRooms] = useState<string[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showAddRoomForm, setShowAddRoomForm] = useState(false);
    const [quoteID, setQuoteID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Retrieve the quote ID from session storage
    useEffect(() => {
        setLoading(true);
        if (typeof window !== "undefined") {
            const storedQuoteID = sessionStorage.getItem('customerData');
            setQuoteID(storedQuoteID);
            const fetchQuoteDetails = async () => {
                try {
                    const facilityDetails = await getFacilityOptions();
                    const quoteDetails = await getQuoteDetails(storedQuoteID);
                    const facilityType = quoteDetails.quoteInfo?.facilityType || '';

                    // Update the list of rooms from the quote details.
                    setRooms(quoteDetails.quoteInfo?.selectedRooms || []);
                    if (!quoteDetails.quoteInfo?.selectedRooms || quoteDetails.quoteInfo?.selectedRooms.length === 0) {
                        setShowAddRoomForm(true);
                    }
                    // Update facilityRooms based on the facility type.
                    setFacilityRooms(facilityDetails?.facility_options[facilityType] || []);
                } catch (error) {
                    console.error('Error fetching quote details:', error);
                }
            };
            fetchQuoteDetails();


        }
        setLoading(false);
    }, []);

    const handleAddRoom = async (newRoom: Room) => {

        setRooms((prevRooms) => [...prevRooms, newRoom]);
        // Await the manualAddRoom function before hiding the form.
        await manualAddRoom(quoteID, newRoom);

    };

    const handleDeleteRoom = async (oldRoom: Room) => {
        setRooms((prevRooms) => prevRooms.filter((room) => room !== oldRoom));
        await manualDeleteRoom(quoteID, oldRoom);
        if (rooms.length === 0) {
            setShowAddRoomForm(true);
        }
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <QuoteProgressBar stepNumber={3} />
            <div className="bg-[#001F54] text-white p-8 rounded-md shadow-lg max-w-2xl text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Step <span className='text-yellow-500'>3</span>: Room Information</h1>
                <p className="text-xl">
                    Please add the rooms in your facility, along with some important information for each room.
                </p>
            </div>
            {showAddRoomForm ? (
                <CustomerAddRoomForm onAddRoom={handleAddRoom} onExit={onExit} roomTypeOptions={facilityRooms} rooms={rooms} />
            ) : (
                <button onClick={() => setShowAddRoomForm(true)} className="bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 mb-8">
                    Add Room
                </button>
            )}

            <CustomerRoomsList rooms={rooms} onDeleteRoom={handleDeleteRoom} />
            {(rooms.length > 0) &&
                <button onClick={() => router.push('/get-a-quote/frequency')} className="bg-green-600 hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300 mt-8">
                    Confirm Room Information
                </button>
            }

        </div>
    );
};

export default CustomerAddRooms;
