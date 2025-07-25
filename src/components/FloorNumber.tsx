'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import updateFloorInfo from '@/utils/updateFloorInfo';

interface QuoteFormProps {
  quoteID: any;
  floorNumber: any;
  stairwells: any;
  onNextStep: (stepNumber: number) => void;
  onMoveOn: (moveOn: boolean) => void;
  onLoading: (isLoading: boolean) => void;
  onChangeInfo: (newFloorNumber: any, newStairwells: any) => void;
  onCanClick: (step: any, canClick: boolean) => void;
}

const FloorNumber: React.FC<QuoteFormProps> = ({
  quoteID,
  floorNumber,
  stairwells,
  onNextStep,
  onMoveOn,
  onLoading,
  onChangeInfo,
  onCanClick,
}) => {
  const [newFloorNumber, setNewFloorNumber] = useState<any>(floorNumber);
  const [carpetStairwells, setCarpetStairwells] = useState<number>(
    stairwells?.carpetStairwells || 0
  );
  const [hardfloorStairwells, setHardfloorStairwells] = useState<number>(
    stairwells?.hardfloorStairwells || 0
  );

  useEffect(() => {
    const stairTotal =
      carpetStairwells + hardfloorStairwells;
    const originalTotal =
      (stairwells?.carpetStairwells || 0) + (stairwells?.hardfloorStairwells || 0);

    if (
      !newFloorNumber ||
      newFloorNumber !== floorNumber ||
      newFloorNumber === 0 ||
      stairTotal !== originalTotal
    ) {
      onMoveOn(false);
    } else {
      onMoveOn(true);
    }
  }, [newFloorNumber, carpetStairwells, hardfloorStairwells]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLoading(true);

    const newStairwells = {
      carpetStairwells,
      hardfloorStairwells,
    };

    onChangeInfo(newFloorNumber, newStairwells);

    const newFloorInfo = {
      floors: newFloorNumber,
      stairwells: newStairwells,
    };

    try {
      await updateFloorInfo(quoteID, newFloorInfo);
      onNextStep(3);
      onCanClick(3, true);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-200 p-10 rounded-xl shadow-2xl max-w-2xl w-full border border-yellow-500">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-semibold text-[#001F54] border-b border-yellow-500 inline-block mb-4">
          Enter Floor and Stairwell Information
        </h3>

        <div className="flex flex-col gap-4 text-gray-700">
          <label>
            Number of Floors:
            <input
              type="number"
              min="0"
              value={newFloorNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewFloorNumber(parseInt(e.target.value))
              }
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <label>
            Carpeted Stairwells:
            <input
              type="number"
              min="0"
              value={carpetStairwells}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCarpetStairwells(parseInt(e.target.value))
              }
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <label>
            Hard Floor Stairwells:
            <input
              type="number"
              min="0"
              value={hardfloorStairwells}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setHardfloorStairwells(parseInt(e.target.value))
              }
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </label>
        </div>
        {(newFloorNumber != 0 && newFloorNumber != floorNumber && carpetStairwells != stairwells?.carpetStairwells && hardfloorStairwells != stairwells?.hardfloorStairwells) && (
        <button
          type="submit"
          className="w-full py-4 mt-6 bg-yellow-500 text-white font-extrabold text-xl rounded-md shadow-md hover:bg-[#001F54] transition duration-300"
        >
          Confirm Floor Info
        </button>
        )}
      </form>
    </div>
  );
};

export default FloorNumber;
