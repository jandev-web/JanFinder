// components/OwnerSellQuoteClient.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Member = {
  CBOID?: string;
  firstName?: string;
  lastName?: string;
  [k: string]: any;
};

type Owner = {
  OwnerID: string;
  [k: string]: any;
};

type Props = {
  owner: Owner;
  quoteID: string | null;
  initialMembers: Member[];

  // server actions (passed from server file)
  sellQuoteAction: (form: { quoteID: string; targetUser: string; ownerID: string }) => Promise<{ ok: boolean }>;
};

export default function OwnerSellQuoteClient({
  owner,
  quoteID,
  initialMembers,
  sellQuoteAction,
}: Props) {
  const router = useRouter();

  const [franchiseMembers] = useState<Member[]>(() => initialMembers);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [cleanId, setCleanId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  console.log(owner)
  const ownerID = owner?.data?.OwnerID;
  console.log(franchiseMembers)
  const targetUser = useMemo(() => {
    if (selectedMember) return selectedMember;
    if (cleanId.trim()) return cleanId.trim();
    if (email.trim()) return email.trim();
    return '';
  }, [selectedMember, cleanId, email]);

  const handleSellQuote = async () => {
    try {
      setError('');
      setLoading(true);

      if (!quoteID) throw new Error('Missing quoteID.');
      if (!ownerID) throw new Error('Missing owner ID.');
      if (!targetUser) throw new Error('Please select a member or provide a CleanID or email.');
      
      const res = await sellQuoteAction({ quoteID, targetUser, ownerID });
      if (!res?.ok) throw new Error('Failed to send quote.');
      alert('Quote sent successfully!');
      router.push(`/members/owner/quotes/accepted`);
    } catch (e: any) {
      console.error('Error selling quote:', e);
      setError(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => {
              if (quoteID) router.push(`/members/owner/quote/accepted?quoteID=${quoteID}`);
              else router.back();
            }}
            className="inline-flex items-center text-[#001F54] hover:text-yellow-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="ml-2 font-semibold text-lg">Back</span>
          </button>
          <h1 className="flex-grow text-center text-3xl font-bold text-[#001F54]">Sell Quote</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-10">
          <div className="space-y-6">
            {/* Dropdown for Franchise Members */}
            <div>
              <label className="block text-xl font-semibold text-[#001F54] mb-2">Select Franchise Member</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">-- Select a member --</option>
                {franchiseMembers.map((member, idx) => (
                  <option key={member.CBOID ?? idx} value={member.CBOID ?? ''}>
                    {member.FirstName} {member.LastName}
                  </option>
                ))}
              </select>
            </div>

            {/* OR Separator */}
            <div className="text-center font-semibold text-gray-500">OR</div>

            {/* Search by CleanID# */}
            <div>
              <label className="block text-xl font-semibold text-[#001F54] mb-2">Search by CleanID#</label>
              <input
                type="text"
                value={cleanId}
                onChange={(e) => setCleanId(e.target.value)}
                placeholder="Enter CleanID#"
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            {/* Search by Email */}
            <div>
              <label className="block text-xl font-semibold text-[#001F54] mb-2">Search by Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 font-medium text-center">{error}</div>}

            {/* Sell Quote Button */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleSellQuote}
                className="px-6 py-3 bg-yellow-500 text-[#001F54] font-semibold rounded-lg hover:bg-yellow-400 transition"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Sell Quote'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer slot if you want to inject it here */}
        {/* <OwnerFooter /> */}
      </div>
    </div>
  );
}
