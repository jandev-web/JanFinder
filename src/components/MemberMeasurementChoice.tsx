import React, { useState } from 'react';

interface MeasurementChoiceProps {
    onChoice: (choice: 'total' | 'detailed', sqft?: number, budget?: number) => void;
    onSubmit: (sqft: number, budget: number) => void;
    rooms: any[]; // To check if existing rooms should be cleared
    onClearRooms: () => void; // Function to clear rooms when confirmed
}

const MeasurementChoice: React.FC<MeasurementChoiceProps> = ({ onChoice, onSubmit, rooms, onClearRooms }) => {
    const [isTotalSelected, setIsTotalSelected] = useState(false);
    const [sqft, setSqft] = useState<number | null>(null);
    const [budget, setBudget] = useState<number | null>(null);
    const [showManPrompt, setManClearPrompt] = useState(false);
    const [showAutoPrompt, setAutoClearPrompt] = useState(false);


    const handleTotalSelection = () => {
        if (rooms.length > 0) {
            // Show confirmation prompt if there is room data to clear
            setAutoClearPrompt(true);
        }
        else {
            setIsTotalSelected(true);
            onChoice('total');  // Notify parent of total choice
        }
        
    };

    const handleDetailedSelection = () => {
        if (rooms.length > 0) {
            // Show confirmation prompt if there is room data to clear
            setManClearPrompt(true);
        } else {
            onChoice('detailed');
        }
    };

    const handleManClearRoomsConfirm = () => {
        onClearRooms(); // Clear the rooms in parent
        setManClearPrompt(false);
        onChoice('detailed'); // Set to detailed measurement after clearing
    };

    const handleAutoClearRoomsConfirm = () => {
        onClearRooms(); // Clear the rooms in parent
        setAutoClearPrompt(false);
        onChoice('total'); // Set to detailed measurement after clearing
    };

    const handleSubmit = () => {
        if (sqft && budget) {
            onSubmit(sqft, budget); // Pass sqft and budget to parent
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Measurement Choice</h2>

            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={handleTotalSelection}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Automatic
                </button>
                <button
                    onClick={handleDetailedSelection}
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                >
                    Manual
                </button>
            </div>

            {isTotalSelected && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-green-700 font-semibold mb-2">Total Sqft</label>
                        <input
                            type="number"
                            value={sqft || ''}
                            onChange={(e) => setSqft(parseFloat(e.target.value))}
                            placeholder="Enter total sqft"
                            className="w-full p-2 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-green-700 font-semibold mb-2">Budget</label>
                        <input
                            type="number"
                            value={budget || ''}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                            placeholder="Enter budget"
                            className="w-full p-2 border-2 border-green-500 rounded-lg text-green-700 focus:outline-none"
                        />
                    </div>

                    {sqft && budget && (
                        <button
                            onClick={handleSubmit}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Enter
                        </button>
                    )}
                </div>
            )}

            {showManPrompt && (
                <div className="clear-prompt mt-6">
                    <p>Would you like to clear all existing room data to switch to manual measurements?</p>
                    <button
                        onClick={handleManClearRoomsConfirm}
                        className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                    >
                        Yes, Clear All Rooms
                    </button>
                    <button
                        onClick={() => setManClearPrompt(false)}
                        className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            )}
            {showAutoPrompt && (
                <div className="clear-prompt mt-6">
                    <p>Would you like to clear all existing room data to switch to auto measurements?</p>
                    <button
                        onClick={handleAutoClearRoomsConfirm}
                        className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                    >
                        Yes, Clear All Rooms
                    </button>
                    <button
                        onClick={() => setAutoClearPrompt(false)}
                        className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default MeasurementChoice;
