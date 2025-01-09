export const calculateRoomSqft = async (sqft, rooms) => {
    const finalRooms = [];

    rooms.forEach(room => {
        const roomSqft = (room.percent / 100) * sqft;
        const roomObject = { type: room.name, sqft: roomSqft }; 
        finalRooms.push(roomObject); 
    });

    console.log('Final Room Calculations:', finalRooms);
    return finalRooms;
};
