// components/pages/CBOAvailableQuoteClient.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CBOFooter from '@/components/CBOFooter';

type Props = {
  requestID: string; // only the request ID, no request object
  quote: any | null;
  memberCBOID: string;
  getQuotePdfAction: () => Promise<{ url: string }>;
  acceptQuoteAction: (args: { requestID: string; memberCBOID: string }) => Promise<any>;
};

export default function CBOAvailableQuoteClient({
  requestID,
  quote,
  memberCBOID,
  getQuotePdfAction,
  acceptQuoteAction,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [error, setError] = useState<string>('');
  console.log(requestID)
  const timestamp: string | undefined =
    quote?.Timestamp ?? quote?.createdAt ?? quote?.created_at;

  const customer = useMemo(() => {
    return (
      quote?.customerData ??
      quote?.form?.customerInfo ??
      quote?.customer ??
      null
    );
  }, [quote]);

  const address = customer?.address ?? null;

  const quoteInfo = useMemo(() => {
    return quote?.quoteInfo ?? quote?.form?.quoteInfo ?? null;
  }, [quote]);

  const pkg = useMemo(() => {
    return quote?.Package?.packageChoice ?? quote?.form?.packageChoice ?? null;
  }, [quote]);

  const rooms = pkg?.rooms ?? pkg?.packageRooms ?? [];
  const price = pkg?.packageCost ?? pkg?.cost ?? quote?.price ?? null;
  const totalDayTime = pkg?.totalDayTimeFromMonth ?? null;

  const formatDate = (ts?: string) => {
    if (!ts) return 'N/A';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return `${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
  };

  const goBack = () => router.push('/business/cbo/quotes/available');

  const onAccept = async () => {
    try {
      setError('');
      setLoading(true);
      await acceptQuoteAction({ requestID, memberCBOID });
      alert('Offer accepted! Contract generation has started.');
      router.push('/business/cbo/quotes/available');
    } catch (e: any) {
      console.error('Accept error:', e);
      setError(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDecline = async () => {
    console.log('Decline clicked for requestID:', requestID);
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
            Contract Offer Details
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-10">
          {error && <div className="mb-4 text-center text-red-600 font-medium">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#001F54]">Price</h2>
                <p className="mt-2 text-lg text-gray-800">
                  {price != null ? `$${price}` : '—'}
                </p>
              </div>

              {address && (
                <div>
                  <h3 className="text-xl font-semibold text-[#001F54]">Facility Address</h3>
                  <p>
                    {address.street}{address.street ? ', ' : ''}
                    {address.city}{address.city ? ', ' : ''}
                    {address.state} {address.postalCode}{address.country ? ', ' : ''}{address.country}
                  </p>
                </div>
              )}

              {customer && (
                <div>
                  <h3 className="text-xl font-semibold text-[#001F54]">Customer Information</h3>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li><strong>Company:</strong> {customer.company ?? '—'}</li>
                    <li><strong>Customer:</strong> {customer.firstName} {customer.lastName}</li>
                    <li><strong>Email:</strong> {customer.email}</li>
                    <li><strong>Phone:</strong> {customer.phone}</li>
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold text-[#001F54]">Created On</h3>
                <p className="mt-2 text-gray-600">{formatDate(timestamp)}</p>
              </div>

              {quoteInfo && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h3 className="text-xl font-semibold text-[#001F54] mb-2">Quote Information</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    <li><strong>Facility Type:</strong> {quoteInfo.facilityType ?? '—'}</li>
                    <li><strong>Square Feet:</strong> {quoteInfo.sqft ?? '—'}</li>
                  </ul>
                </div>
              )}

              {pkg && (
                <div>
                  <h3 className="text-xl font-semibold text-[#001F54]">Package Details</h3>
                  <p className="mt-2 text-gray-800"><strong>Package:</strong> {pkg.packageName ?? pkg.name ?? '—'}</p>
                  <p className="mt-1 text-gray-800"><strong>Cost:</strong> {price != null ? `$${price}` : '—'}</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            {pkg && (
              <div>
                {totalDayTime != null && (
                  <h4 className="text-lg font-semibold text-[#001F54] mb-4">
                    Total Day Time: {Number(totalDayTime).toFixed(2)} min/day
                  </h4>
                )}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[36rem] overflow-y-auto space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#001F54] mb-4">Rooms</h3>
                    {Array.isArray(rooms) && rooms.length > 0 ? rooms.map((room: any, idx: number) => (
                      <div key={idx} className="border-b border-gray-300 pb-4">
                        <h4 className="text-lg font-semibold text-[#001F54]">
                          {room.roomName ?? room.name ?? `Room ${idx + 1}`} –{' '}
                          <span className="text-gray-600">
                            {room.totalDayTimeFromMonth != null
                              ? `${Number(room.totalDayTimeFromMonth).toFixed(2)} min/day`
                              : '—'}
                          </span>
                        </h4>
                        <ul className="pl-4 mt-2 space-y-2">
                          {(room.roomTasks ?? room.tasks ?? []).map((task: any, tIdx: number) => (
                            <li key={tIdx} className="flex justify-between text-sm">
                              <div className="font-medium">{task.taskName ?? task.name}</div>
                              <div className="italic text-gray-500">
                                {(task.frequency ?? task.taskFrequency) ?? '—'} –{' '}
                                {task.timePerDayFromMonthly != null
                                  ? `${Number(task.timePerDayFromMonthly).toFixed(2)} min/day`
                                  : '—'}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )) : (
                      <div className="text-gray-500">No rooms/tasks.</div>
                    )}
                  </div>

                  {pkg?.carpet?.tasks?.length > 0 && (
                    <div className="border-t border-gray-300 pt-4">
                      <h3 className="text-xl font-bold text-[#001F54] mb-2">Carpet</h3>
                      <p className="text-gray-600 mb-2">
                        Total: {Number(pkg.carpet.totalDayTimeFromMonth ?? 0).toFixed(2)} min/day
                      </p>
                      <ul className="pl-4 space-y-2">
                        {pkg.carpet.tasks.map((task: any, idx: number) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <div className="font-medium">{task.taskName}</div>
                            <div className="italic text-gray-500">
                              {task.frequency} – {Number(task.timePerDayFromMonthly ?? 0).toFixed(2)} min/day
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pkg?.hardfloor?.tasks?.length > 0 && (
                    <div className="border-t border-gray-300 pt-4">
                      <h3 className="text-xl font-bold text-[#001F54] mb-2">Hardfloor</h3>
                      <p className="text-gray-600 mb-2">
                        Total: {Number(pkg.hardfloor.totalDayTimeFromMonth ?? 0).toFixed(2)} min/day
                      </p>
                      <ul className="pl-4 space-y-2">
                        {pkg.hardfloor.tasks.map((task: any, idx: number) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <div className="font-medium">{task.taskName}</div>
                            <div className="italic text-gray-500">
                              {task.frequency} – {Number(task.timePerDayFromMonthly ?? 0).toFixed(2)} min/day
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 text-center">
            {!showAcceptConfirmation && !showRejectConfirmation ? (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowAcceptConfirmation(true)}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
                >
                  Accept Offer
                </button>
                <button
                  onClick={() => setShowRejectConfirmation(true)}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
                >
                  Decline Offer
                </button>
              </div>
            ) : showAcceptConfirmation ? (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onAccept}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition disabled:opacity-60"
                >
                  {loading ? 'Processing...' : 'Confirm Acceptance'}
                </button>
                <button
                  onClick={() => setShowAcceptConfirmation(false)}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onDecline}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectConfirmation(false)}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <CBOFooter />
      </div>
    </div>
  );
}
