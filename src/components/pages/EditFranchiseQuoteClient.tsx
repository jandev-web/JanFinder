// components/pages/FranchiseEditQuoteClient.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import getQuoteTemplate from '@/utils/getQuoteTemplateClient';
import deleteFranchiseTemplate from '@/utils/deleteFranchiseTemplate';
import updateFranchisePDFName from '@/utils/setFranchisePDFName';

import "@aws-amplify/ui-react/styles.css";
type Props = {
  owner: any;
  franchise: any;
  setTemplate: (franchiseID: string, templateType: 'quote' | 'contract', isThere: boolean) => Promise<any>;
};

export default function FranchiseEditQuoteClient({ owner, franchise, setTemplate }: Props) {
  const router = useRouter();
  console.log(franchise)
  const franchiseID = useMemo(
    () => franchise?.FranchiseID ?? owner?.franchiseID ?? owner?.franchiseId ?? null,
    [franchise, owner]
  );

  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasTemplate = !!(
    franchise?.data?.quoteTemplate &&
    franchise?.data?.quoteTemplate !== 'none' &&
    franchise?.data?.quoteTemplate !== false
  );

  const currentTemplateName =
    typeof franchise?.quoteTemplate === 'string'
      ? franchise.quoteTemplate
      : hasTemplate
        ? 'quoteTemplate.docx'
        : null;

  const handleBack = () => router.push('/members/owner/franchise');

  const downloadQuoteTemplate = async () => {
    console.log(franchiseID)
    if (!franchiseID) return;
    setError(null);
    setBusy(true);
    try {
      const tmpl = await getQuoteTemplate(franchiseID); // { url: string | URL, filename?: string }
      if (!tmpl?.url) throw new Error('No URL returned for quote template');

      const urlStr = typeof tmpl.url === 'string' ? tmpl.url : tmpl.url.toString();

      const a = document.createElement('a');
      a.href = urlStr; // <-- string now
      if (currentTemplateName) a.download = currentTemplateName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e: any) {
      console.error('Download error:', e);
      setError('Failed to download template. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!franchiseID) return;
    setError(null);
    setDeleteBusy(true);
    try {
      await deleteFranchiseTemplate(franchiseID, 'quote');
      router.push('/members/owner/franchise');
    } catch (e: any) {
      console.error('Delete error:', e);
      setError('Failed to delete template. Please try again.');
    } finally {
      setDeleteBusy(false);
    }
  };


  if (!franchiseID) {
    return (
      <div className="max-w-md mx-auto bg-white p-6">
        <button
          className="absolute top-4 left-4 pt-2 pb-10 pl-4 pr-4 text-lg font-semibold text-[#001F54] hover:text-yellow-500 transition"
          onClick={handleBack}
        >
          &lt; Back to Franchise Info
        </button>
        <p className="text-red-500">Franchise not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-10 relative">
      <button
        className="absolute top-4 left-4 pt-2 pb-10 pl-4 pr-4 text-lg font-semibold text-[#001F54] hover:text-yellow-500 transition"
        onClick={handleBack}
      >
        &lt; Back to Franchise Info
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Edit Franchise Quote
      </h2>

      <div className="mb-8">
        <p className="text-lg text-gray-700">Current Quote Template:</p>

        {hasTemplate ? (
          <div className="mt-2 flex items-center justify-between">
            <span
              role="button"
              onClick={downloadQuoteTemplate}
              className="text-lg text-blue-600 cursor-pointer hover:underline"
            >
              {currentTemplateName}
            </span>
            <button
              onClick={downloadQuoteTemplate}
              disabled={busy}
              className="p-2 bg-gray-100 text-blue-700 rounded-full hover:bg-yellow-100 transition-colors focus:outline-none disabled:opacity-50"
              aria-label="Download Quote Template"
            >
              {busy ? (
                <span className="text-sm px-1">...</span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
              )}
            </button>
          </div>
        ) : (
          <p className="mt-2 text-lg text-red-500">No quote template uploaded</p>
        )}

        {hasTemplate && (
          <button
            onClick={handleDeleteTemplate}
            disabled={deleteBusy}
            className="w-full mt-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleteBusy ? 'Deleting Template...' : 'Delete Quote Template'}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold">Upload Franchise Quote Template</h3>

        <FileUploader
          acceptedFileTypes={['.docx']}
          path={`members/franchise/${franchiseID}/templates/quote/`} // <-- NO leading slash, NO 'public/' prefix
          maxFileCount={1}
          isResumable={false}                                 // single-part upload for now
          processFile={({ file }) => ({ file, key: 'quote-template.docx' })} // optional: fixed name
          onUploadStart={(e) => console.log('[Uploader] start', e)}
          onUploadSuccess={async () => {
            try {
              await setTemplate(franchiseID, 'quote', true);
              router.refresh();
            } catch (e) {
              console.error('setTemplate after upload failed', e);
            }
          }}
          onUploadError={(e) => console.error('[Uploader] error', e)}
        />








      </div>

      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
    </div>
  );
}
