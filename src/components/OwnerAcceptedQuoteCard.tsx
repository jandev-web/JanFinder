// src/components/OwnerAcceptedQuoteCard.tsx
'use client';

import React from 'react';

type OwnerAcceptedQuoteCardProps = {
  quote: any;                 // raw quote or { quoteDetails, ... } shape unwrapped by parent
  requestDetails?: any;       // optional: pass item.requestDetails if you want status dots
  onClick: () => void;
};

function pickRequest(details: any) {
  if (!details) return null;
  if (Array.isArray(details)) return details[0] ?? null;
  return details;
}

function getStatus(requestDetails: any) {
  const r = pickRequest(requestDetails);
  if (!r) return null;

  const decision = String(r.decision ?? '').toLowerCase();
  const fromSeen = r.FromSeen ?? r.fromSeen;

  if (decision === 'none') {
    return { color: 'bg-yellow-500', label: 'Pending Request' };
  }
  if (decision === 'reject' && fromSeen === false) {
    return { color: 'bg-red-500', label: 'Rejected Request' };
  }
  if (decision === 'accept') {
    return { color: 'bg-green-600', label: 'Accepted' };
  }
  return null;
}

function fmtCurrency(val: unknown) {
  if (val == null) return '—';
  const num = typeof val === 'string' ? Number(val) : (val as number);
  if (Number.isFinite(num)) {
    try {
      return num.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    } catch {
      // Fallback if locale/currency fails
      return `$${(num as number).toFixed(2)}`;
    }
  }
  // If template already produced a formatted string like "$1,234.56"
  return String(val);
}

const OwnerAcceptedQuoteCard: React.FC<OwnerAcceptedQuoteCardProps> = ({
  quote,
  requestDetails,
  onClick,
}) => {
  // Defensive unwraps
  const q = quote ?? {};
  const quoteId: string | undefined = q.QuoteID ?? q.quoteId ?? q.id;

  const customer = q.customerData ?? {};
  const company: string | undefined = customer.company;
  const first = customer.firstName ?? '';
  const last = customer.lastName ?? '';
  const customerName = company || `${first} ${last}`.trim() || 'Customer';

  const pkg = q.Package ?? q.package ?? {};
  const pkgChoice = pkg.packageChoice ?? {};
  const pkgName = pkgChoice.packageName ?? pkg.name ?? '';
  const cost =
    pkgChoice.packageCost ??
    pkg.cost ??
    q.costInfo?.finalCost ??
    q.cost ??
    null;

  const status = getStatus(requestDetails);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white hover:bg-yellow-50 border border-gray-200 p-4 rounded-lg shadow-sm text-left transition duration-200 ease-in-out relative"
      aria-label={quoteId ? `Open accepted quote ${quoteId}` : 'Open accepted quote'}
    >
      {/* Status dot (optional, only shows if requestDetails provided) */}
      {status && (
        <span
          className={`absolute top-2 right-2 h-3 w-3 rounded-full ${status.color}`}
          title={status.label}
          aria-label={status.label}
        />
      )}

      <div className="space-y-1">
        <p className="text-sm text-gray-500">Quote ID: <span className="font-mono">{quoteId ?? '—'}</span></p>

        <p className="text-lg font-semibold text-gray-900">
          {customerName}
          {pkgName ? <span className="ml-2 text-gray-500 font-normal">• {pkgName}</span> : null}
        </p>

        <div className="text-gray-700">
          <p><strong>Cost:</strong> {fmtCurrency(cost)}</p>
        </div>
      </div>
    </button>
  );
};

export default OwnerAcceptedQuoteCard;
