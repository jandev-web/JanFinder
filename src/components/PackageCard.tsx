import React, { useState, useEffect } from 'react';
import { updatePackage } from '@/utils/updatePackageChoice';
import { useRouter } from 'next/navigation';
import updateQuoteCost from '@/utils/updateQuoteCost';
import roundingUtil from '@/utils/roundingUtil';

interface Task {
  taskName: string;
  taskFrequency: string;
}

interface Room {
  roomName: string;
  tasks: Task[];
}

interface CleanPackage {
  name: string;
  rooms: Room[];
  description: string;
}

interface PackageCardProps {
  cleanPackage: CleanPackage;
  cost: any;
  quoteID: any;
}

const PackageCard: React.FC<PackageCardProps> = ({ cleanPackage, cost, quoteID }) => {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [finalCost, setFinalCost] = useState(cost);

  const router = useRouter();

  useEffect(() => {
    let calculatedCost = roundingUtil(cost);
    if (cleanPackage.name === 'Radiant Results') {
      calculatedCost = roundingUtil(cost / 1.2);
    } else if (cleanPackage.name === 'Pure Essentials') {
      calculatedCost = roundingUtil(cost * 0.64);
    }
    setFinalCost(calculatedCost);
  }, [cleanPackage.name, cost]);

  const handleSelectPackage = async (pkg: CleanPackage) => {
    try {
      const response = await updatePackage(quoteID, pkg);
      const roundCost = roundingUtil(finalCost)
      await updateQuoteCost(quoteID, { finalCost: roundCost });
      
      console.log(response)
      if (response.updatedAttributes) {
        setConfirmationMessage('Package updated successfully!');
        setTimeout(() => {
          
          router.push(`/get-a-quote/confirm`);
        }, 1000);
      } else {
        setConfirmationMessage('Failed to update package. Please try again.');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      setConfirmationMessage('Error updating package. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#001F54] to-blue-600 text-white shadow-lg rounded-xl p-8 w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-extrabold text-yellow-400 mb-4">{cleanPackage.name} Package</h2>
      <p className="font-semibold text-yellow-300 mb-2">Description:</p>
      <p className="text-yellow-200 mb-4">{cleanPackage.description}</p>
      <p className="text-lg font-bold text-yellow-400">Cost: ${finalCost.toFixed(2)}</p>

      <h3 className="text-xl font-bold text-yellow-300 mt-6">Included Services:</h3>
      <div className="space-y-6">
        {cleanPackage.rooms.map((room, index) => (
          <div key={index} className="border-b border-gray-300 pb-4">
            <h4 className="text-xl font-semibold text-[#001F54] mb-2">{room.roomName}</h4>
            <ul className="pl-4 space-y-2">
              {room.tasks.map((task, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex justify-between items-center">
                  <span className="font-medium">{task.taskName}</span>
                  <span className="italic text-gray-500">{task.taskFrequency}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Centered button with confirmation message */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handleSelectPackage(cleanPackage)}
          className="bg-yellow-400 text-[#001F54] font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition"
        >
          Select {cleanPackage.name}
        </button>
      </div>

      {confirmationMessage && (
        <p className="mt-4 text-center text-yellow-300 font-semibold">
          {confirmationMessage}
        </p>
      )}
    </div>
  );
};

export default PackageCard;
