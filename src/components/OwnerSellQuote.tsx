import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import fetchAllCBOs from '@/utils/getAllCBOs';
interface OwnerSellQuoteProps {
    user: any;
    quoteID: any;
  }

const OwnerSellQuote: React.FC<OwnerSellQuoteProps> = ({ user, quoteID }) => {
  const router = useRouter();
    
  const [franchiseMembers, setFranchiseMembers] = useState<any>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [cleanId, setCleanId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  //console.log(user)
  // Example: Load franchise members from an API when component mounts
  useEffect(() => {
    async function loadFranchiseMembers() {
      try {
        // Replace this with your actual API call
        const data = await fetchAllCBOs(user.OwnerID);
        console.log(data)
        setFranchiseMembers(data);
      } catch (err) {
        console.error('Error loading franchise members:', err);
        setError('Failed to load franchise members.');
      }
    }
    loadFranchiseMembers();
  }, []);

  

  const handleSellQuote = async () => {
    setError('');
    setLoading(true);
    try {
      // Determine target based on selection or search inputs
      let targetUser = '';
      if (selectedMember) {
        targetUser = selectedMember;
      } else if (cleanId.trim() !== '') {
        targetUser = cleanId.trim();
      } else if (email.trim() !== '') {
        targetUser = email.trim();
      } else {
        throw new Error('Please select a member or provide a CleanID or email.');
      }

      // Replace with your API call to sell the quote. For example:
      const response = await fetch('/api/sell-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUser })
      });
      if (!response.ok) {
        throw new Error('Failed to sell quote.');
      }
      // Handle success (e.g., show a success message or redirect)
      alert('Quote sold successfully!');
    } catch (err: any) {
      console.error('Error selling quote:', err);
      setError(err.message);
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
            onClick={() => router.push(`/members/owner/quote/accepted?quoteID=${quoteID}`)}
            className="inline-flex items-center text-[#001F54] hover:text-yellow-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="ml-2 font-semibold text-lg">Back</span>
          </button>
          <h1 className="flex-grow text-center text-3xl font-bold text-[#001F54]">
            Sell Quote
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-10">
          <div className="space-y-6">
            {/* Dropdown for Franchise Members */}
            <div>
              <label className="block text-xl font-semibold text-[#001F54] mb-2">
                Select Franchise Member
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">-- Select a member --</option>
                {franchiseMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* OR Separator */}
            <div className="text-center font-semibold text-gray-500">OR</div>

            {/* Search by CleanID# */}
            <div>
              <label className="block text-xl font-semibold text-[#001F54] mb-2">
                Search by CleanID#
              </label>
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
              <label className="block text-xl font-semibold text-[#001F54] mb-2">
                Search by Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 font-medium text-center">{error}</div>
            )}

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
      </div>
    </div>
  );
};

export default OwnerSellQuote;
