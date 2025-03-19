import React from 'react';
import { useRouter } from 'next/navigation';
import deleteFranchise from '@/utils/deleteFranchise';
import getPDFTemplate from '@/utils/getPDFTemplate';

interface FranchiseInfoProps {
    franchise: any;
    ownerID: any;
}

const FranchiseInfo: React.FC<FranchiseInfoProps> = ({ franchise, ownerID }) => {
    const router = useRouter();

    const downloadPDF = async () => {
        try {
            const quotePDF = await getPDFTemplate(franchise?.FranchiseID);

            const response = await fetch(quotePDF.url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `contract.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Failed to download PDF. Please try again later.');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteFranchise(ownerID);
            router.push('/members/logging-out');
        } catch (error) {
            alert('Failed to delete franchise. Please try again later.');
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
                <button
                    onClick={() => router.push('/members/owner/franchise/edit-name')}
                    className="ml-auto px-4 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded hover:bg-yellow-400 transition"
                >
                    Edit
                </button>
            </div>

            {/* Horizontal Separator */}
            <hr className="border-gray-300 mb-6" />

            {/* PDF Template Section */}
            <div className="flex items-center">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">PDF Template</span>
                    <div className="h-6 border-l border-gray-300 mx-4"></div>
                    <span
                        onClick={downloadPDF}
                        className="text-lg text-gray-700 cursor-pointer hover:underline"
                    >
                        {franchise?.contractPDF}
                    </span>
                    <button
                        onClick={downloadPDF}
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
                <button
                    onClick={() => router.push('/members/owner/franchise/edit-template')}
                    className="ml-auto px-4 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded hover:bg-yellow-400 transition"
                >
                    Edit
                </button>
            </div>

            {/* Separator between PDF Template and Delete Section */}
            <hr className="border-gray-300 my-6" />

            <div className="flex items-center">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">Delete Franchise</span>
                    <div className="h-6 border-l border-gray-300 mx-4"></div>
                    <span className="text-lg text-gray-700">{franchise?.contractPdf}</span>
                </div>
                <button
                    onClick={handleDelete}
                    className="ml-auto px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
                >
                    Delete Franchise
                </button>
            </div>


        </div>
    );
};

export default FranchiseInfo;
