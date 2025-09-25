// src/components/pages/FranchiseMembersClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';

type Member = {
  CBOID: string;
  FirstName: string;
  LastName: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  createdAt?: string | null;
};

export default function FranchiseMembersClient({
  members,
  addHref,
}: {
  members: Member[];
  addHref: string;
}) {
  console.log(members)
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-4">
        <Link
          href="/business/owner"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
        >
          {/* optional icon: ← */}
          <span>←</span>
          <span>Back</span>
        </Link>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-[#001F54]">
          Franchise Members
        </h1>
        {/* No header button—keeps exactly one add button visible overall */}
      </div>

      {(!members || members.length === 0) ? (
        // Empty state with single Add button
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">No members yet.</p>
          <Link
            href={addHref}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <PlusIcon />
            Add Franchise Member
          </Link>
        </div>
      ) : (
        // List with a single Add button at the bottom
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <ul className="divide-y divide-gray-200">
            {members.map((m) => {
              const id = m.CBOID;
              const display = [m.FirstName, m.LastName].join(' ');
              console.log(display)
              return (
                <li key={id} className="p-0">
                  <Link
                    href={`/business/franchise/owner/business/${encodeURIComponent(id)}`}
                    className="block p-4 hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-[#001F54]">{display}</span>
                  </Link>
                </li>
              );
            })}
          </ul>


          <div className="flex justify-end border-t p-4">
            <Link
              href={addHref}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <PlusIcon />
              Add More Members
            </Link>
          </div>
        </div>
      )}
    </div>
  );

}
