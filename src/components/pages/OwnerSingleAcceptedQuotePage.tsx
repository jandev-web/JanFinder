'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type OwnerQuoteClientProps = {
  initialQuote: any | null;
  getQuotePdfAction: () => Promise<{ url: string }>;
};

const OwnerQuoteClient: React.FC<OwnerQuoteClientProps> = ({
  initialQuote,
  getQuotePdfAction,
}) => {
  const [quote] = useState<any>(initialQuote);
  const router = useRouter();

  // Safely read fields regardless of snake/camel case drift
  const quoteID =
    quote?.QuoteID ?? quote?.quoteID ?? quote?.id ?? quote?.quoteId ?? null;

  const price = useMemo(
    () =>
      quote?.Package?.packageChoice?.packageCost ??
      quote?.Package?.packagePrice ??
      quote?.costInfo?.finalCost ??
      0,
    [quote]
  );

  const customerData = quote?.customerData ?? {};
  const address = customerData?.address ?? {};
  const timestamp = quote?.Timestamp ?? quote?.createdAt ?? null;
  const quoteInfo = quote?.quoteInfo ?? null;
  const pkg = quote?.Package ?? null;

  const formatDate = (ts?: string) => {
    if (!ts) return 'N/A';
    const d = new Date(ts);
    return `${d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })} at ${d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })}`;
  };

  const downloadPDF = async () => {
    try {
      const { url } = await getQuotePdfAction();
      const resp = await fetch(url);
      const blob = await resp.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const company = customerData?.company ?? 'Quote';
      link.download = `${company}_Quote.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF. Please try again later.');
    }
  };

  const goBack = () => {
    router.push('/members/owner/quotes/available');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="inline-flex items-center text-[#001F54] hover:text-yellow-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="ml-2 font-semibold text-lg">Back</span>
          </button>
          <h1 className="flex-grow text-center text-3xl font-bold text-[#001F54]">
            Quote Details
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Price */}
              <div>
                <h2 className="text-2xl font-bold text-[#001F54]">Price</h2>
                <p className="mt-2 text-lg text-gray-800">${price}</p>
              </div>

              {/* Address */}
              {(address?.street || address?.city || address?.state || address?.postalCode || address?.country) && (
                <div>
                  <h3 className="text-xl font-semibold text-[#001F54]">Facility Address</h3>
                  <p>
                    {address.street}{address.street && ','} {address.city}{address.city && ','} {address.state} {address.postalCode}{address.country && ','} {address.country}
                  </p>
                </div>
              )}

              {/* Customer */}
              {customerData && (
                <div>
                  <h3 className="text-xl font-semibold text-[#001F54]">Customer Information</h3>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li><strong>Company:</strong> {customerData.company}</li>
                    <li><strong>Customer:</strong> {customerData.firstName} {customerData.lastName}</li>
                    <li><strong>Email:</strong> {customerData.email}</li>
                    <li><strong>Phone:</strong> {customerData.phone}</li>
                  </ul>
                </div>
              )}

              {/* Created Timestamp */}
              <div>
                <h3 className="text-xl font-semibold text-[#001F54]">Created On</h3>
                <p className="mt-2 text-gray-600">{formatDate(timestamp)}</p>
              </div>

              {/* Quote Info */}
              {quoteInfo && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h3 className="text-xl font-semibold text-[#001F54] mb-2">Quote Information</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    <li><strong>Facility Type:</strong> {quoteInfo.facilityType}</li>
                    <li><strong>Square Feet:</strong> {quoteInfo.sqft}</li>
                  </ul>
                </div>
              )}

              {/* Package Summary */}
              {pkg?.packageChoice && (
                <div>
                  <h3 className="text-xl font-semibold text-[#001F54]">Package Details</h3>
                  <p className="mt-2 text-gray-800">
                    <strong>Package:</strong> {pkg.packageChoice.packageName}
                  </p>
                  <p className="mt-1 text-gray-800">
                    <strong>Cost:</strong> ${pkg.packageChoice.packageCost}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Tasks */}
            {pkg?.packageChoice && (
              <div>
                <h4 className="text-lg font-semibold text-[#001F54] mb-4">
                  Total Day Time: {pkg.packageChoice.totalDayTimeFromMonth?.toFixed?.(2)} min/day
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[36rem] overflow-y-auto space-y-6">
                  {/* Rooms */}
                  {pkg.packageChoice.rooms?.length ? (
                    <div>
                      <h3 className="text-xl font-bold text-[#001F54] mb-4">Rooms</h3>
                      {pkg.packageChoice.rooms.map((room: any, idx: number) => (
                        <div key={idx} className="border-b border-gray-300 pb-4">
                          <h4 className="text-lg font-semibold text-[#001F54]">
                            {room.roomName} – <span className="text-gray-600">{room.totalDayTimeFromMonth?.toFixed?.(2)} min/day</span>
                          </h4>
                          <ul className="pl-4 mt-2 space-y-2">
                            {room.roomTasks?.map((task: any, i: number) => (
                              <li key={i} className="flex justify-between text-sm">
                                <div className="font-medium">{task.taskName}</div>
                                <div className="italic text-gray-500">
                                  {task.frequency} – {task.timePerDayFromMonthly?.toFixed?.(2)} min/day
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Carpet */}
                  {pkg.packageChoice.carpet?.tasks?.length ? (
                    <div className="border-t border-gray-300 pt-4">
                      <h3 className="text-xl font-bold text-[#001F54] mb-2">Carpet</h3>
                      <p className="text-gray-600 mb-2">
                        Total: {pkg.packageChoice.carpet.totalDayTimeFromMonth?.toFixed?.(2)} min/day
                      </p>
                      <ul className="pl-4 space-y-2">
                        {pkg.packageChoice.carpet.tasks.map((task: any, i: number) => (
                          <li key={i} className="flex justify-between text-sm">
                            <div className="font-medium">{task.taskName}</div>
                            <div className="italic text-gray-500">
                              {task.frequency} – {task.timePerDayFromMonthly?.toFixed?.(2)} min/day
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Hardfloor */}
                  {pkg.packageChoice.hardfloor?.tasks?.length ? (
                    <div className="border-t border-gray-300 pt-4">
                      <h3 className="text-xl font-bold text-[#001F54] mb-2">Hardfloor</h3>
                      <p className="text-gray-600 mb-2">
                        Total: {pkg.packageChoice.hardfloor.totalDayTimeFromMonth?.toFixed?.(2)} min/day
                      </p>
                      <ul className="pl-4 space-y-2">
                        {pkg.packageChoice.hardfloor.tasks.map((task: any, i: number) => (
                          <li key={i} className="flex justify-between text-sm">
                            <div className="font-medium">{task.taskName}</div>
                            <div className="italic text-gray-500">
                              {task.frequency} – {task.timePerDayFromMonthly?.toFixed?.(2)} min/day
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Other */}
                  {pkg.packageChoice.otherDayTimeFromMonth ? (
                    <div className="border-t border-gray-300 pt-4">
                      <h3 className="text-xl font-bold text-[#001F54] mb-2">Other Tasks</h3>
                      <p className="text-gray-600">
                        Total: {pkg.packageChoice.otherDayTimeFromMonth?.toFixed?.(2)} min/day
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 text-center">
            <div className="flex justify-center space-x-4">
              {/* Example: navigate to sell flow */}
              {quoteID && (
                <button
                  onClick={() => router.push(`/members/owner/quote/sell?quoteID=${quoteID}`)}
                  className="px-6 py-3 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
                >
                  Sell Quote
                </button>
              )}
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
              >
                Download Quote PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerQuoteClient;
