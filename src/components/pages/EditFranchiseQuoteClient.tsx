// components/pages/FranchiseEditQuoteClient.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import getQuoteTemplate from '@/utils/getQuoteTemplateClient';
import testFranchiseQuoteTemplate from '@/utils/testFranchiseQuoteTemplateClient';

import '@aws-amplify/ui-react/styles.css';

type Props = {
  owner: any;
  franchise: any;
  setTemplate: (franchiseID: string, templateType: 'quote' | 'contract', isThere: boolean) => Promise<any>;
  deleteTemplateAndUnset: (franchiseID: string) => Promise<any>;
};

export default function FranchiseEditQuoteClient({ owner, franchise, setTemplate, deleteTemplateAndUnset }: Props) {
  const router = useRouter();

  const franchiseID = useMemo(
    () => franchise?.FranchiseID ?? owner?.franchiseID ?? owner?.franchiseId ?? null,
    [franchise, owner]
  );

  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test-run UI state
  const [testing, setTesting] = useState(false);
  const [testPdfUrl, setTestPdfUrl] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  const hasTemplate = !!(
    franchise?.data?.quoteTemplate &&
    franchise?.data?.quoteTemplate !== 'none' &&
    franchise?.data?.quoteTemplate !== false
  );

  const currentTemplateName =
    typeof franchise?.quoteTemplate === 'string'
      ? franchise.quoteTemplate
      : hasTemplate
        ? 'quote-template.docx'
        : null;

  const handleBack = () => router.push('/business/owner/franchise');

  const downloadQuoteTemplate = async () => {
    if (!franchiseID) return;
    setError(null);
    setBusy(true);
    try {
      const tmpl = await getQuoteTemplate(franchiseID);
      if (!tmpl?.url) throw new Error('No URL returned for quote template');
      const urlStr = typeof tmpl.url === 'string' ? tmpl.url : tmpl.url.toString();

      const a = document.createElement('a');
      a.href = urlStr;
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
      await deleteTemplateAndUnset(franchiseID);
      router.push('/business/owner/franchise');
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

      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Edit Franchise Quote</h2>

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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
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
          path={`members/franchise/${franchiseID}/templates/quote/`}
          maxFileCount={1}
          isResumable={false}
          // Always upload to the expected key; we'll roll back (delete + skip DDB) on failure.
          processFile={({ file }) => ({ file, key: 'quote-template.docx' })}
          onUploadStart={() => {
            setError(null);
            setIssues([]);
            setTesting(false);
            setTestPdfUrl(null);
          }}
          onUploadSuccess={async () => {
            try {
              // 1) Validate immediately
              setTesting(true);
              const res = await testFranchiseQuoteTemplate(franchiseID);
              setTesting(false);

              const payload = typeof res?.body === 'string' ? JSON.parse(res.body) : res;
              const statusOk = (res?.statusCode ?? 200) < 400;
              const allIssues = Array.isArray(payload?.issues) ? payload.issues : [];

              // Treat "Missing block marker(s)" as a hard fail; recommendations are warnings.
              // Fail on *any* issue (warnings included)
              const passed = statusOk && !!payload?.pdfUrl && allIssues.length === 0;

              if (!passed) {
                // 2) On failure: DON'T mark in DDB, and remove the just-uploaded file
                const hasCritical = allIssues.some((i: string) => /Missing block marker/i.test(i));

                setError(
                  hasCritical
                    ? 'Template failed validation: required block markers are missing.'
                    : payload?.message || 'Template failed validation. Please address the warnings and try again.'
                );
                setIssues(allIssues);
                setTestPdfUrl(null);
                try {
                  await deleteTemplateAndUnset(franchiseID);
                } catch (delErr) {
                  console.warn('Cleanup delete failed (template left on S3):', delErr);
                }
                return;
              }

              // 3) On success: mark template present in DDB
              await setTemplate(franchiseID, 'quote', true);

              // 4) Show warnings (if any) and link to test PDF
              setIssues(allIssues);
              setTestPdfUrl(typeof payload?.pdfUrl === 'string' ? payload.pdfUrl : null);

              // 5) Refresh so "Current Quote Template" link appears if it was missing
              router.refresh();
            } catch (e: any) {
              console.error('post-upload error', e);
              setTesting(false);
              setError('Upload succeeded, but the test run failed. Please review your template and try again.');
              // Try to remove the uploaded template since we didn’t validate it
              try {
                await deleteTemplateAndUnset(franchiseID);
              } catch (delErr) {
                console.warn('Cleanup delete failed (template left on S3):', delErr);
              }
            }
          }}
          onUploadError={(e) => {
            console.error('[Uploader] error', e);
            setError('Upload failed. Please try again.');
          }}
        />

        {testing && <div className="text-sm text-gray-600">Running a test fill and conversion…</div>}

        {!!issues.length && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
            <div className="font-semibold mb-1">Template warnings</div>
            <ul className="list-disc pl-5">
              {issues.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Show link when available (passed path sets this) */}
        {!testing && !error && testPdfUrl && (
          <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-900">
            Test PDF created:&nbsp;
            <a className="text-green-800 underline" href={testPdfUrl} target="_blank" rel="noreferrer">
              quote-template-test.pdf
            </a>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
    </div>
  );
}
