'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AllRoomsQuote from '@/components/AllRoomsQuote';
import CustomerAddRoomForm, { Room } from './CustomerAddRoomForm';
import getQuoteDetails from '@/utils/getQuoteDetails';
import { getFacilityOptions } from '@/utils/getFacilityOptions';
import LoadingSpinner from '@/components/loadingScreen';
import { manualAddRoom } from '@/utils/manualAddRoom';

const AddRoomsQuote: React.FC = () => {
  const [facilityRooms, setFacilityRooms] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [quoteID, setQuoteID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Retrieve the quote ID from session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedQuoteID = sessionStorage.getItem('customerData');
      setQuoteID(storedQuoteID);
    }
    setLoading(false);
  }, []);

  // Fetch quote details and facility options once the quoteID is available.
  useEffect(() => {
    if (!quoteID) return; // Do nothing if there is no quoteID.
    const fetchQuoteDetails = async () => {
      try {
        const facilityDetails = await getFacilityOptions();
        const quoteDetails = await getQuoteDetails(quoteID);
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
  }, [quoteID]);

  const handleAddRoom = async (newRoom: Room) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    // Await the manualAddRoom function before hiding the form.
    await manualAddRoom(quoteID, newRoom);
    setShowAddRoomForm(false);
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
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-[#001F54] mb-8">Add Rooms to Your Quote</h2>
        <p className="text-lg text-gray-700 mb-8">
          Please review your current rooms and add more as needed. When you&apos;re ready, continue to the next step.
        </p>

        {/* Display the list of rooms if any exist */}
        {rooms.length > 0 && (
          <div className="mb-8">
            <AllRoomsQuote rooms={rooms} />
          </div>
        )}

        {/* Conditionally render the add room form or the action buttons */}
        {showAddRoomForm ? (
          <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
            <CustomerAddRoomForm
              onAddRoom={handleAddRoom}
              roomTypeOptions={facilityRooms}
              onExit={onExit}
            />
          </div>
        ) : (
          rooms.length > 0 && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowAddRoomForm(true)}
                className="bg-[#001F54] hover:bg-[#001840] text-white py-3 px-6 rounded transition duration-300"
              >
                Add More Rooms
              </button>
              <button
                onClick={() => router.push('/get-a-quote/frequency')}
                className="bg-yellow-400 hover:bg-yellow-500 text-white py-3 px-6 rounded transition duration-300"
              >
                Continue to Packages
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default AddRoomsQuote;
