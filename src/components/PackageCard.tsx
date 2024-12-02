import React, { useState } from 'react';
import { updatePackage } from '@/utils/updatePackageChoice';
import { useRouter } from 'next/navigation';

interface Task {
  taskName: string;
  taskFrequency: string;
}

interface Room {
  roomName: string;
  tasks: Task[];
}

interface CleanPackage {
  id: string;
  name: string;
  cost: number;
  description: string;
  tasks: Room[];
  blurb: string;
}

interface PackageCardProps {
  cleanPackage: CleanPackage;
}

const PackageCard: React.FC<PackageCardProps> = ({ cleanPackage }) => {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectPackage = async (pkg: CleanPackage) => {
    try {
      const response = await updatePackage(pkg);
      const id = pkg?.id;
      if (response.success === true) {
        setConfirmationMessage('Package updated successfully!');
        setTimeout(() => {
          const queryString = new URLSearchParams({ id }).toString();
          router.push(`/confirmation?${queryString}`);
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
      <p className="text-lg font-bold text-yellow-400">Cost: ${cleanPackage.cost.toFixed(2)}</p>

      <h3 className="text-xl font-bold text-yellow-300 mt-6">Included Services:</h3>
      <ul className="list-disc list-inside text-yellow-200 space-y-2 mt-2">
        {cleanPackage.tasks.map((room, index) => (
          <li key={index} className="mt-2">
            <span className="font-bold text-yellow-400">{room.roomName}</span>
            <ul className="ml-4 list-disc list-inside">
              {room.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>
                  {task.taskName} - <span className="italic">{task.taskFrequency}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

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
