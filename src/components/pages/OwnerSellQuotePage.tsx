// components/OwnerSellQuoteClient.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Member = {
  CBOID?: string;
  id?: string;
  FirstName?: string;
  LastName?: string;
  firstName?: string;
  lastName?: string;
  [k: string]: any;
};

type Request = {
  id?: string | null;
  toCboID?: string | null;
  ToCBOID?: string | null;
  quoteID?: string | null;
  status?: string | null;
  createdOn?: string | null;
  CreatedOn?: string | null;
  Timestamp?: string | null;
  timestamp?: string | null;
  _raw?: any;
  [k: string]: any;
};

type Owner = { OwnerID: string; [k: string]: any };

type Props = {
  owner: Owner;
  quoteID: string | null;
  initialMembers: Member[];
  initialRequests: Request[];
  sellQuoteAction: (form: { quoteID: string; targetUser: string; ownerID: string }) => Promise<{ ok: boolean }>;
};

export default function OwnerSellQuoteClient({
  owner,
  quoteID,
  initialMembers,
  initialRequests,
  sellQuoteAction,
}: Props) {
  const router = useRouter();

  const [franchiseMembers] = useState<Member[]>(() => initialMembers ?? []);
  const [pendingRequests] = useState<Request[]>(() => initialRequests ?? []);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [cleanId, setCleanId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const ownerID = owner?.data?.OwnerID ?? owner?.OwnerID;
  console.log(initialMembers)
  console.log(initialRequests)
  // Helpers
  const getMemberId = (m: Member) => m.CBOID ?? m.id ?? '';

  // >>> Enforce proper display as FirstName LastName (fallback to lower-case only if needed)
  const getMemberName = (m?: Member) => {
    const first = m?.FirstName ?? m?.firstName ?? '';
    const last  = m?.LastName  ?? m?.lastName  ?? '';
    return [first, last].filter(Boolean).join(' ');
  };

  const getReqCboId = (r: Request) =>
    r.TargetUser ?? '';

  const getReqTime = (r: Request) =>
     r.createdAt ?? '';

  const byId = useMemo(() => {
    const map = new Map<string, Member>();
    for (const m of franchiseMembers) {
      const id = getMemberId(m);
      if (id) map.set(id, m);
    }
    return map;
  }, [franchiseMembers]);

  // Members that already have an active (pending) request
  const membersWithActiveReq = useMemo(() => {
    const set = new Set<string>();
    for (const r of pendingRequests) {
      const id = getReqCboId(r);
      if (id) set.add(id);
    }
    return set;
  }, [pendingRequests]);

  // Dropdown options: exclude already-requested members
  const eligibleMembers = useMemo(
    () => franchiseMembers.filter((m) => !membersWithActiveReq.has(getMemberId(m))),
    [franchiseMembers, membersWithActiveReq]
  );

  // Target user
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

  const formatWhen = (when: string) => {
    try {
      const d = new Date(when);
      return isNaN(d.getTime()) ? when : d.toLocaleString?.() ?? when;
    } catch {
      return when;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Use a column layout; flex-1 keeps Pending box at the bottom when content is short */}
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
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

        {/* Main content area (takes remaining height) */}
        <div className="flex-1">
          {/* Sell Quote card */}
          <div className="bg-white shadow-lg rounded-lg p-8 md:p-10">
            <div className="space-y-6">
              {/* Dropdown (excluding already-requested) */}
              <div>
                <label className="block text-xl font-semibold text-[#001F54] mb-2">Select Franchise Member</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">-- Select a member --</option>
                  {eligibleMembers.map((member, idx) => {
                    const id = getMemberId(member) || `idx-${idx}`;
                    // Force "FirstName LastName" label, fallback to lower-case or id
                    const label =
                      getMemberName(member) ||
                      [member?.firstName, member?.lastName].filter(Boolean).join(' ') ||
                      id;
                    return (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
                {eligibleMembers.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    All members already have a pending request for this quote.
                  </p>
                )}
              </div>

              {/* OR */}
              <div className="text-center font-semibold text-gray-500">OR</div>

              {/* CleanID */}
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

              {/* Email */}
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

              {/* Error */}
              {error && <div className="text-red-500 font-medium text-center">{error}</div>}

              {/* Action */}
              <div className="flex justify-center mt-6">
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

        {/* Pending Requests — anchored after the flex-1 area so it stays at the bottom */}
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#001F54] mb-3">Pending Requests</h2>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pendingRequests.map((r, idx) => {
                  const cboId = getReqCboId(r);
                  const member = cboId ? byId.get(cboId) : undefined;
                  // Force FirstName LastName for display
                  const name =
                    getMemberName(member) ||
                    (cboId ? `Member (${cboId.slice(0, 8)}…)` : 'Unknown member');
                  const when = formatWhen(getReqTime(r) || '');
                  return (
                    <li key={r.id ?? cboId ?? idx} className="py-3 flex items-center justify-between">
                      <span className="font-medium text-[#001F54]">{name}</span>
                      <span className="text-sm text-gray-500">{when}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
