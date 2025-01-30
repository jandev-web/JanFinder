'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getQuoteDetails from '@/utils/getQuoteDetails';
import getQuotePDF from '@/utils/getQuotePDF';
import makeQuotePDF from '@/utils/generateQuoteDoc'

interface ConfirmOwnerQuoteProps {
    handleBack: () => void;
    quoteID: any;
    user: any;
}

const ConfirmOwnerQuote: React.FC<ConfirmOwnerQuoteProps> = ({ handleBack, quoteID, user }) => {
    const [quoteInfo, setQuoteInfo] = useState<any>(null);
    const [address, setAddress] = useState<any>('None');

    const [hasPDF, setHasPDF] = useState(false)
    const router = useRouter();
    const userID = user?.OwnerId
    const franchiseID = user?.franchiseID
    const handleConfirm = () => {
        alert('Quote confirmed successfully!');
        router.push('/members/quotes');
    };

    const downloadPDF = async () => {
        try {
            const quotePDF = await getQuotePDF(quoteID);
            
            const response = await fetch(quotePDF.url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `contract.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const generatePDF = async () => {
        try {

            await makeQuotePDF(quoteID, franchiseID);
            setHasPDF(true)

        } catch (error) {
            console.error('Error generating quote document:', error);
        }
    };


    useEffect(() => {
        const getQuoteInfo = async () => {
            if (quoteID) {
                try {
                    const quoteDetails = await getQuoteDetails(quoteID);
                    const addressInfo = quoteDetails.customerData.address
                    if (!addressInfo.city || !addressInfo.country || !addressInfo.postalCode || !addressInfo.state || !addressInfo.street) {
                        setAddress('None')
                    }
                    else {
                        const addressString = `${addressInfo.street}, ${addressInfo.city} ${addressInfo.state}, ${addressInfo.postalCode}, ${addressInfo.country}`
                        setAddress(addressString)
                    }
                    setQuoteInfo(quoteDetails);
                    if (quoteDetails.QuotePDF != null) {
                        setHasPDF(true)
                    }

                } catch (error) {
                    console.error('Error fetching quote details:', error);
                }
            }
        };
        getQuoteInfo();
    }, [quoteID, userID, hasPDF]);

    if (!quoteInfo) {
        return <p>Loading quote details...</p>;
    }

    const { customerData, quoteInfo: quoteDetails, costInfo } = quoteInfo;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full border border-gray-300">
                <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Confirm Quote</h1>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-green-700">Customer Information</h2>
                    <p><strong>Company:</strong> {customerData?.company || 'None'}</p>
                    <p><strong>Email:</strong> {customerData?.email || 'None'}</p>
                    <p><strong>Phone:</strong> {customerData?.phone || 'None'}</p>
                    <p><strong>Address:</strong> {address || 'None'}</p>
                </div>

                <div className="space-y-6 mt-6">
                    <h2 className="text-xl font-semibold text-green-700">Quote Information</h2>
                    <p><strong>Facility Type:</strong> {quoteDetails?.facilityType || 'None'}</p>
                    <p><strong>Frequency:</strong> {quoteDetails?.frequency || 'None'}</p>
                    <p><strong>Cost:</strong> {costInfo?.finalCost || 'None'}</p>
                    <p><strong>Square Footage:</strong> {quoteDetails?.sqft || 'None'}</p>
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                    >
                        Back
                    </button>
                    <button
                        onClick={generatePDF}
                        className="px-6 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                    >
                        Generate PDF
                    </button>

                    {hasPDF && (
                        <button
                            onClick={downloadPDF}
                            className="px-6 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                        >
                            Download PDF
                        </button>
                    )}

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
