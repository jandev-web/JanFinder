import React from 'react';
import getContractTemplate from '@/utils/getContractTemplate';
import getQuoteTemplate from '@/utils/getQuoteTemplateClient';

interface CBOFranchiseInfoProps {
    franchise: any;
    owner: any;
}

const CBOFranchiseInfo: React.FC<CBOFranchiseInfoProps> = ({ franchise, owner }) => {
    
    console.log(owner)
    const downloadQuoteTemplate = async () => {
        try {
            const quoteTemplate = await getQuoteTemplate(franchise?.FranchiseID);

            const response = await fetch(quoteTemplate.url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${franchise?.quoteTemplate}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Failed to download PDF. Please try again later.');
        }
    };

    const downloadContractTemplate = async () => {
        try {
            const contractTemplate = await getContractTemplate(franchise?.FranchiseID);


            const response = await fetch(contractTemplate.url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${franchise?.contractTemplate}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Failed to download PDF. Please try again later.');
        }
    };

    

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-300 p-6">
            {/* Franchise Name Section */}
            <div className="flex items-center mb-6">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <div className="h-6 border-l border-gray-300 mx-4"></div>
                    <span className="text-2xl font-bold text-[#001F54]">
                        {franchise?.franchiseName}
                    </span>
                </div>
                
            </div>

            {/* Horizontal Separator */}
            <hr className="border-gray-300 mb-6" />
            <div className="flex items-center mb-6">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">Owner</span>
                    <div className="h-6 border-l border-gray-300 mx-4"></div>
                    <span className="text-lg text-gray-700">
                        {owner?.firstName} {owner?.lastName}
                    </span>
                </div>
                
            </div>

            {/* Horizontal Separator */}
            <hr className="border-gray-300 mb-6" />

            <div className="flex items-center mb-6">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <div className="h-6 border-l border-gray-300 mx-4"></div>
                    <span className="text-lg text-gray-700">
                        {owner?.email}
                    </span>
                </div>
                
            </div>

            {/* Horizontal Separator */}
            <hr className="border-gray-300 mb-6" />

            
            <div className="flex items-center">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">Quote Template</span>
                    <div className="h-6 border-l border-gray-300 mx-4"></div>
                    <span
                        onClick={downloadQuoteTemplate}
                        className="text-lg text-gray-700 cursor-pointer hover:underline"
                    >
                        {franchise?.quoteTemplate}
                    </span>
                    <button
                        onClick={downloadQuoteTemplate}
                        className="ml-4 p-2 bg-transparent text-[#001F54] rounded transition hover:text-yellow-500 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                            />
                        </svg>
                    </button>


                </div>
                
            </div>

            <hr className="border-gray-300 my-6" />

            <div className="flex items-center">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">Contract Template</span>
                    <div className="h-6 border-l border-gray-300 mx-4"></div>
                    <span
                        onClick={downloadContractTemplate}
                        className="text-lg text-gray-700 cursor-pointer hover:underline"
                    >
                        {franchise?.contractTemplate}
                    </span>
                    <button
                        onClick={downloadContractTemplate}
                        className="ml-4 p-2 bg-transparent text-[#001F54] rounded transition hover:text-yellow-500 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                            />
                        </svg>
                    </button>


                </div>
                
            </div>

            


        </div>
    );
};

export default CBOFranchiseInfo;
