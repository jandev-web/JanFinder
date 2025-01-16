'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getQuotePDF from '@/utils/getQuotePDF';

interface ConfirmOwnerQuoteProps {
    handleBack: () => void;
    quoteID: any;
    userID: any;
}

const ConfirmOwnerQuote: React.FC<ConfirmOwnerQuoteProps> = ({ handleBack, quoteID, userID }) => {
    const [quoteInfo, setQuoteInfo] = useState<any>(null);
    const [quotePDF, setQuotePDF] = useState<string | null>(null);
    const router = useRouter();

    const handleConfirm = () => {
        alert('Quote confirmed successfully!');
        router.push('/members/quotes');
    };

    const downloadPDF = () => {
        if (quotePDF) {
            const link = document.createElement('a');
            link.href = quotePDF;
            link.download = `quote_${quoteID}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('No PDF available to download.');
        }
    };

    useEffect(() => {
        const getQuoteInfo = async () => {
            if (quoteID) {
                try {
                    const quoteDetails = await getQuoteDetails(quoteID);
                    setQuoteInfo(quoteDetails);
                    const pdfUrl = await getQuotePDF(quoteID, userID);
                    console.log(pdfUrl)
                    setQuotePDF(pdfUrl);
                } catch (error) {
                    console.error('Error fetching quote details:', error);
                }
            }
        };
        getQuoteInfo();
    }, [quoteID, userID]);

    if (!quoteInfo) {
        return <p>Loading quote details...</p>;
    }

    const { customerData, quoteInfo: quoteDetails } = quoteInfo;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full border border-gray-300">
                <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Confirm Quote</h1>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-green-700">Customer Information</h2>
                    <p><strong>Company:</strong> {customerData?.company || 'N/A'}</p>
                    <p><strong>Email:</strong> {customerData?.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {customerData?.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {customerData?.address?.street || 'N/A'}, {customerData?.address?.city || 'N/A'}, {customerData?.address?.state || 'N/A'}, {customerData?.address?.postalCode || 'N/A'}</p>
                </div>

                <div className="space-y-6 mt-6">
                    <h2 className="text-xl font-semibold text-green-700">Quote Information</h2>
                    <p><strong>Facility Type:</strong> {quoteDetails?.facilityType || 'N/A'}</p>
                    <p><strong>Frequency:</strong> {quoteDetails?.frequency || 'N/A'}</p>
                    <p><strong>Budget:</strong> {quoteDetails?.budget || 'N/A'}</p>
                    <p><strong>Square Footage:</strong> {quoteDetails?.sqft || 'N/A'}</p>
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                    >
                        Back
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="px-6 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOwnerQuote;
