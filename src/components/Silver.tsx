'use client';

import React from 'react';

interface PackageProps {
    pkg: any;
    recPackage: any;
    chosenPackage: any;
    handleSelect: () => void;
}

const Silver: React.FC<PackageProps> = ({ pkg, recPackage, chosenPackage, handleSelect }) => {
    


    const iconSrc = '/images/vacuum_icon.png'

    const cost = pkg.packageCost;
    const rec = pkg.packageType === recPackage.packageType ? true : false;
    const chosen = pkg.packageType === chosenPackage?.packageType ? true : false;

    const bulletPoints = [
        'Deep cleaning of high-traffic areas',
        'Dusting & vacuuming',
        'Trash removal',
        'Window cleaning (interior and basic exterior)'
    ];

    return (
        <div className={`min-w-[240px] relative overflow-hidden bg-white rounded-t-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 ${rec ? 'border-t-4 border-l-4 border-r-4 border-green-700' : ''} flex flex-col justify-between h-full`}>
            <div className="flex-grow">
                {rec && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-sm font-bold px-3 py-1 pt-4 rounded-full shadow-md">
                        Recommended
                    </div>
                )}
                <img
                    src={iconSrc}
                    alt={`${pkg.name} icon`}
                    className="mx-auto h-16 w-16 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.packageName}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">${cost.toFixed(2)}</p>
                <ul className="mb-6 space-y-2">
                    {bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start text-gray-600 text-sm">
                            <span className="mr-2 mt-1">•</span>
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Button Section */}
            <div className='flex-shrink-0'>
                {chosen ? (
                    <p className="font-medium text-green-700 py-2">Selected!</p>
                ) : (
                    <button
                        onClick={handleSelect}
                        className="w-full bg-green-700 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex-shrink-0"
                    >
                        Select {pkg.name}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Silver;
