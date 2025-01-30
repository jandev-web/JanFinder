'use client';

import React, { useState, useEffect } from 'react';

interface MemberCustomCostProps {
    onConfirmCustom: (customCost: number) => void;
    onExit: () => void;
    initialCustomCost: any;
}

const MemberCustomCost: React.FC<MemberCustomCostProps> = ({ onConfirmCustom, onExit, initialCustomCost }) => {
    const [customCost, setCustomCost] = useState<string>('0');
    const [originalCustomCost, setOriginalCustomCost] = useState<string>(customCost);
    const [isConfirming, setIsConfirming] = useState(false);
    const [editState, setEditState] = useState(false);
    useEffect(() => {
        if (initialCustomCost) {
            setCustomCost(initialCustomCost);
        }
    }, [initialCustomCost]);
    const handleConfirm = () => {
        const parsedCost = parseFloat(customCost);
        if (!isNaN(parsedCost)) {
            onConfirmCustom(parsedCost);
            setOriginalCustomCost(customCost);
            setEditState(false);
            onExit()
        } else {
            alert('Please enter a valid cost.');
        }
    };

    const handleInputChange = (value: string) => {

        // Allow non-negative numbers with optional decimals
        if (!/^\d*\.?\d{0,2}$/.test(value)) {
  
            return;
        }
        if (value.startsWith('.')) {
            value = '0' + value;
        }
        setCustomCost(value);
        setEditState(true);
    };

    const handleBlur = () => {
        if (isConfirming) {
            // If the user is confirming, skip resetting the input
            return;
        }

        setCustomCost(originalCustomCost);
        setEditState(false);
    };



    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
            <label className="block text-gray-800 font-semibold mb-2">Custom Cost ($)</label>
            <input
                type="text"
                value={customCost}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={() => handleBlur()}
                className="w-full p-3 border-2 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {(editState && customCost.trim() !== '' && customCost !== originalCustomCost) && (
                <button
                    onMouseDown={() => setIsConfirming(true)}  // Set the flag before the blur event fires
                    onClick={() => {
                        handleConfirm();
                        setIsConfirming(false);  // Reset the flag after confirming
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition"
                >
                    Confirm
                </button>
            )}

            <button
                onClick={onExit}
                className="ml-4 bg-gray-500 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition"
            >
                Back
            </button>
        </div>
    );
};

export default MemberCustomCost;
