'use client';

import React, { useMemo, useState } from 'react';
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
  console.log(franchise)
  // Normalize franchise shape (sometimes .data, sometimes flat)
  const f = useMemo(() => {
    const raw = franchise?.data ?? franchise ?? {};
    // Parse address if it came in as a JSON string (AWSJSON)
    let address = raw.franchiseAddress ?? raw.address;
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address);
      } catch {
        // leave as string if parsing fails
      }
    }
    return { ...raw, franchiseAddress: address };
  }, [franchise]);

  // Safe getters + fallbacks
  const franchiseName: string = f.franchiseName ?? '—';
  const franchiseId: string =
    f.franchiseAccountNumber ?? f.FranchiseAccountNumber ?? '—';

  const franchiseEmail: string = f.franchiseEmail ?? 'No email';
  const franchisePhone: string = f.franchisePhone ?? 'No phone';
  const franchiseWebsite: string = f.franchiseWebsite ?? 'No website';
  const createdOnRaw = f.createdOn ?? f.createdAt ?? null;

  const createdOn = useMemo(() => {
    if (!createdOnRaw) return '—';
    try {
      const d = new Date(createdOnRaw);
      if (isNaN(d.getTime())) return String(createdOnRaw);
      return d.toLocaleString();
    } catch {
      return String(createdOnRaw);
    }
  }, [createdOnRaw]);

  const serviceRegions: string[] = Array.isArray(f.serviceRegions)
    ? f.serviceRegions
    : [];

  const addr = f.franchiseAddress && typeof f.franchiseAddress === 'object'
    ? f.franchiseAddress
    : {};

  const street = addr.street ?? '—';
  const city = addr.city ?? '—';
  const state = addr.state ?? '—';
  const postalCode = addr.postalCode ?? '—';
  const addressLine = [street, city !== '—' || state !== '—' ? `${city}, ${state}` : null, postalCode]
    .filter(Boolean)
    .join(' • ');

  const description: string = f.franchiseDescription ?? f.description ?? 'No description';

  // Logo: show if URL available; otherwise a neutral placeholder
  const logoUrl: string | null =
    f.franchiseLogoUrl ?? f.logoUrl ?? null;

  // Template flags from DB (Gen 2 “setFranchiseTemplate” typically toggles these)
  const hasQuoteTemplate: boolean = !!(f.quoteTemplate ?? f.quoteTemplatePresent);
  const hasContractTemplate: boolean = !!(f.contractTemplate ?? f.contractTemplatePresent);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(franchiseId !== '—' ? franchiseId : '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const Row: React.FC<{ label: string; children: React.ReactNode; editHref?: string }> = ({ label, children, editHref }) => (
    <div className="flex items-start gap-4 py-4">
      <div className="min-w-44 shrink-0 text-sm font-medium text-gray-600">{label}</div>
      <div className="flex-1 text-gray-900">{children}</div>
      {editHref && (
        <a
          href={editHref}
          className="ml-auto inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold text-[#001F54] shadow-sm transition hover:bg-yellow-400"
        >
          Edit
        </a>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Header */}
      <div className="pb-10">
        <OwnerHeader user={owner} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-24 pt-24">
        <h2 className="mb-6 text-center text-4xl font-bold text-[#001F54]">
          Franchise Information
        </h2>

        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          {/* Top: Name + ID */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${franchiseName} logo`}
                  className="h-14 w-14 rounded-lg object-cover ring-1 ring-black/5"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500 ring-1 ring-black/5">
                  Logo
                </div>
              )}
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</div>
                <div className="text-2xl font-semibold text-[#001F54]">{franchiseName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Franchise ID#</div>
                <div className="font-mono text-sm text-[#001F54]">{franchiseId}</div>
              </div>

              <button
                type="button"
                onClick={copyId}
                aria-label={copied ? 'Copied' : 'Copy ID'}
                title={copied ? 'Copied!' : 'Copy ID'}
                className="inline-flex h-9 w-9 items-center justify-center text-[#001F54] transition hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                {copied ? (
                  // Check icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  // Copy icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="9" y="9" width="10" height="10" rx="2" ry="2" strokeWidth="2" />
                    <path d="M7 15H6a2 2 0 01-2-2V6a2 2 0 012-2h7a2 2 0 012 2v1" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

          </div>

          <hr className="my-6 border-gray-200" />

          {/* Details */}
          <div className="divide-y divide-gray-200">
            <Row label="Email" editHref="/business/franchise/owner/edit-email">
              <span className="text-[#001F54]">{franchiseEmail}</span>
            </Row>

            <Row label="Phone" editHref="/business/franchise/owner/edit-phone">
              <span className="text-[#001F54]">{franchisePhone}</span>
            </Row>

            <Row label="Website" editHref="/business/franchise/owner/edit-website">
              {franchiseWebsite !== '—' ? (
                <a
                  href={franchiseWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 underline hover:text-emerald-800"
                >
                  {franchiseWebsite}
                </a>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </Row>

            <Row label="Created On">
              <span className="text-[#001F54]">{createdOn}</span>
            </Row>

            <Row label="Address" editHref="/business/franchise/owner/edit-address">
              <div className="text-[#001F54]">
                <div>{street}</div>
                <div>{city !== '—' || state !== '—' ? `${city}, ${state}` : ''}</div>
                <div>{postalCode}</div>
              </div>
            </Row>

            <Row label="Description" editHref="/business/franchise/owner/edit-description">
              <p className="whitespace-pre-wrap text-[#001F54]">{description}</p>
            </Row>

            <Row label="Logo" editHref="/business/franchise/owner/edit-logo">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Franchise logo"
                  className="h-16 w-16 rounded-lg object-cover ring-1 ring-black/5"
                />
              ) : (
                <span className="text-gray-500">No logo</span>
              )}
            </Row>

            <Row label="Service Regions" editHref="/business/franchise/owner/edit-service-regions">
              {serviceRegions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {serviceRegions.map((r) => (
                    <span
                      key={r}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </Row>

            {/* Templates */}
            <div className="flex items-center gap-4 py-4">
              <div className="min-w-44 shrink-0 text-sm font-medium text-gray-600">Quote Template</div>
              <div className="flex-1">
                {hasQuoteTemplate ? (
                  quoteTemplate?.url ? (
                    <a
                      href={quoteTemplate.url}
                      download={quoteTemplate.filename ?? 'quote-template.pdf'}
                      className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Download (quote-template.pdf)
                    </a>
                  ) : (
                    <span className="text-gray-500">Template available</span>
                  )
                ) : (
                  <span className="text-gray-500">No template</span>
                )}
              </div>
              <a
                href="/business/owner/franchise/edit-template/quote"
                className="ml-auto inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold text-[#001F54] shadow-sm transition hover:bg-yellow-400"
              >
                Edit
              </a>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="min-w-44 shrink-0 text-sm font-medium text-gray-600">Contract Template</div>
              <div className="flex-1">
                {hasContractTemplate ? (
                  contractTemplate?.url ? (
                    <a
                      href={contractTemplate.url}
                      download={contractTemplate.filename ?? 'contract-template.pdf'}
                      className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Download (contract-template.pdf)
                    </a>
                  ) : (
                    <span className="text-gray-500">Template available</span>
                  )
                ) : (
                  <span className="text-gray-500">No template</span>
                )}
              </div>
              <a
                href="/business/owner/franchise/edit-template/contract"
                className="ml-auto inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold text-[#001F54] shadow-sm transition hover:bg-yellow-400"
              >
                Edit
              </a>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Delete Franchise (server action) */}
          <form action={onDelete} className="flex items-center">
            <div className="text-sm font-medium text-gray-700">Delete Franchise</div>
            <input type="hidden" name="ownerID" value={ownerID} />
            <button
              type="submit"
              className="ml-auto inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete Franchise
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
