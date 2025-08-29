'use client';

import React, { useState } from 'react';
import OwnerHeader from '@/components/OwnerHeader';

type TemplateInfo = { url: string; filename?: string } | null;

type Props = {
  owner: any;
  franchise: any;
  ownerID: string;
  quoteTemplate: TemplateInfo;
  contractTemplate: TemplateInfo;
  onDelete: (formData: FormData) => void; // server action passed from server
};

export default function FranchiseClient({
  owner,
  franchise,
  ownerID,
  quoteTemplate,
  contractTemplate,
  onDelete,
}: Props) {
  const [copied, setCopied] = useState(false);
  console.log(franchise.data.franchiseName)
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(franchise?.FranchiseAccountNumber ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header */}
      <div className="pb-10">
        <OwnerHeader user={owner} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-24 pb-24">
        <h2 className="text-4xl font-bold text-[#001F54] mb-6 text-center">
          Franchise Information
        </h2>

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-300 p-6">
          {/* Franchise Name */}
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <div className="h-6 border-l border-gray-300 mx-4" />
              <span className="text-2xl font-bold text-[#001F54]">
                {franchise?.data?.franchiseName ?? '—'}
              </span>
            </div>
            <a
              href="/members/owner/franchise/edit-name"
              className="ml-auto px-4 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded hover:bg-yellow-400 transition"
            >
              Edit
            </a>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* Franchise ID */}
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Franchise ID#</span>
              <div className="h-6 border-l border-gray-300 mx-4" />
              <span className="text-lg text-[#001F54]">
                {franchise?.data?.franchiseAccountNumber ?? '—'}
              </span>
            </div>
            <button
              onClick={copyId}
              className="ml-auto px-4 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded hover:bg-yellow-400 transition"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* Quote Template */}
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Quote Template</span>
              <div className="h-6 border-l border-gray-300 mx-4" />
              {quoteTemplate?.url ? (
                <>
                  <a
                    href={quoteTemplate.url}
                    download={quoteTemplate.filename}
                    className="text-lg text-[#001F54] hover:underline"
                  >
                    {quoteTemplate.filename ?? franchise?.quoteTemplate ?? 'Download'}
                  </a>
                  <a
                    href={quoteTemplate.url}
                    download={quoteTemplate.filename}
                    className="ml-4 p-2 text-[#001F54] rounded transition hover:text-yellow-500 focus:outline-none"
                    aria-label="Download Quote Template"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/>
                    </svg>
                  </a>
                </>
              ) : (
                <span className="text-lg text-gray-500">Not available</span>
              )}
            </div>
            <a
              href="/members/owner/franchise/edit-template/quote"
              className="ml-auto px-4 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded hover:bg-yellow-400 transition"
            >
              Edit
            </a>
          </div>

          <hr className="border-gray-300 my-6" />

          {/* Contract Template */}
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Contract Template</span>
              <div className="h-6 border-l border-gray-300 mx-4" />
              {contractTemplate?.url ? (
                <>
                  <a
                    href={contractTemplate.url}
                    download={contractTemplate.filename}
                    className="text-lg text-[#001F54] hover:underline"
                  >
                    {contractTemplate.filename ?? franchise?.contractTemplate ?? 'Download'}
                  </a>
                  <a
                    href={contractTemplate.url}
                    download={contractTemplate.filename}
                    className="ml-4 p-2 text-[#001F54] rounded transition hover:text-yellow-500 focus:outline-none"
                    aria-label="Download Contract Template"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/>
                    </svg>
                  </a>
                </>
              ) : (
                <span className="text-lg text-gray-500">Not available</span>
              )}
            </div>
            <a
              href="/members/owner/franchise/edit-template/contract"
              className="ml-auto px-4 py-2 bg-yellow-500 text-[#001F54] font-semibold rounded hover:bg-yellow-400 transition"
            >
              Edit
            </a>
          </div>

          <hr className="border-gray-300 my-6" />

          {/* Delete Franchise (server action) */}
          <form action={onDelete} className="flex items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Delete Franchise</span>
              <div className="h-6 border-l border-gray-300 mx-4" />
              <span className="text-lg text-gray-700">{franchise?.contractPdf ?? '—'}</span>
            </div>
            <input type="hidden" name="ownerID" value={ownerID} />
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
            >
              Delete Franchise
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
