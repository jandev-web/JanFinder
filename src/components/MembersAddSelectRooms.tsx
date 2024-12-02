import React from 'react';

interface SelectedRoomsListProps {
    rooms: { roomName: string; sqft: string; floorType: string; difficulty: string }[];
}

const SelectedRoomsList: React.FC<SelectedRoomsListProps> = ({ rooms }) => {
    return (
        <div>
            <h2>Selected Rooms</h2>
            {rooms.map((room, index) => (
                <div key={index}>
                    <p>{room.roomName}</p>
                    <p>Sqft: {room.sqft}</p>
                    <p>Floor Type: {room.floorType}</p>
                    <p>Difficulty: {room.difficulty}</p>
                </div>
            ))}
        </div>
    );
};

export default SelectedRoomsList;
