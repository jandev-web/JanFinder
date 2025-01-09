import React, { useState, useEffect } from 'react';
import getQuoteDetails from '@/utils/getQuoteDetails';
import ManualRoomCard from './ManualRoomCard';

interface SelectedRoomsListProps {
    quoteID: any;
}

const SelectedRoomsList: React.FC<SelectedRoomsListProps> = ({ quoteID }) => {
    const [rooms, setRooms] = useState([])
    const [sqft, setSqft] = useState(0)
    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const details = await getQuoteDetails(quoteID);
                const quoteInfo = details.quoteInfo;
                setRooms(quoteInfo?.selectedRooms || []);
                setSqft(quoteInfo?.sqft || 0)
            } catch (error) {
                console.error('Error fetching quote details:', error);
            }
        };
        fetchQuoteDetails();
    }, [quoteID]);
    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
        <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Selected Rooms</h2>
        <p>Total Square Feet: {sqft}sqft</p>
        {/* List of Rooms */}
        <div className="mb-6 space-y-4">
            {rooms.length > 0 ? (
                rooms.map((room, index) => (
                    <ManualRoomCard key={index} room={room} />
                ))
            ) : (
                <p className="text-center text-yellow-500">No rooms added yet.</p>
            )}
        </div>

    </div>
    );
};

export default SelectedRoomsList;
