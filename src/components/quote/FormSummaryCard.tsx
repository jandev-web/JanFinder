'use client';

import type { Quote } from '@/types/quotes';
import type { QuoteInfo as UIQuoteInfo } from '@/types/quote-ui';
import { PACKAGE_TIER_LABEL, type PackageTier } from '@/types/packages'; // 👈 add this

interface FormSummaryCardProps {
  data: UIQuoteInfo | Quote;
  currentStep: number;
}

type ViewModel = {
  contact?: { firstName?: string; lastName?: string; company?: string; email?: string; phone?: string };
  budget?: number;
  facilityType?: string;
  floors?: number;
  stairwellsCarpeted?: number;
  stairwellsHardfloor?: number;
  sqft?: number;
  floorTypes?: { hardfloor?: number; carpet?: number };
  frequency?: string;
  selectedPackage?: string; // <- we will ensure this is a NAME
};

// ---- type guards ----
function isBackendQuote(x: any): x is Quote {
  return x && typeof x === 'object' && 'QuoteID' in x && 'customerData' in x;
}
function isUIQuoteInfo(x: any): x is UIQuoteInfo {
  return x && typeof x === 'object' && 'contact' in x && 'floorTypePercentages' in x;
}

// ---- normalizers ----
function fromUI(ui: UIQuoteInfo): ViewModel {
  // If UI gives us a tier, convert to label; if it already gave a name, keep it.
  const uiChoice = ui.selectedPackage as string | undefined;
  const nameFromTier = uiChoice && (PACKAGE_TIER_LABEL as Record<string, string>)[uiChoice as PackageTier];
  const selectedPackageName =
    // prefer explicit field if your UI model has it
    (ui as any).selectedPackageName ??
    // otherwise map tier → label
    nameFromTier ??
    // otherwise just show whatever string we have
    uiChoice;

  return {
    contact: {
      firstName: ui.contact?.firstName,
      lastName: ui.contact?.lastName,
      company: ui.contact?.company,
      email: ui.contact?.email,
      phone: ui.contact?.phone,
    },
    budget: ui.budget,
    facilityType: ui.facilityType,
    floors: ui.floors,
    stairwellsCarpeted: ui.stairwellsCarpeted,
    stairwellsHardfloor: ui.stairwellsHardfloor,
    sqft: ui.sqft,
    floorTypes: {
      carpet: ui.floorTypePercentages?.carpet,
      hardfloor: ui.floorTypePercentages?.hardfloor,
    },
    frequency: ui.frequency,
    selectedPackage: selectedPackageName,
  };
}

function fromBackend(quote: Quote): ViewModel {
  const c = quote.customerData;
  const m = quote.customerMeasurements ?? quote.ownerMeasurements;
  const qi = quote.quoteInfo;

  // Best: find exact packageName from options using the stored choice (tier)
  const nameFromOptions =
    quote?.package?.packageOptions?.find(
      (opt) => opt.packageType === quote?.package?.packageChoice
    )?.packageName;

  // Fallback: if no options/name, map the choice tier → label
  const nameFromTier =
    (quote?.package?.packageChoice &&
      (PACKAGE_TIER_LABEL as Record<string, string>)[quote.package.packageChoice as PackageTier]) ||
    undefined;

  const selectedPackageName = nameFromOptions ?? nameFromTier ?? undefined;

  return {
    contact: {
      firstName: c?.firstName || '',
      lastName: c?.lastName || '',
      company: c?.company || '',
      email: c?.email,
      phone: c?.phone,
    },
    budget: qi?.budget,
    facilityType: qi?.facilityType || '',
    floors: m?.floors ?? qi?.floors,
    stairwellsCarpeted: m?.stairwells?.carpet ?? qi?.stairwells?.carpet,
    stairwellsHardfloor: m?.stairwells?.hardfloor ?? qi?.stairwells?.hardfloor,
    sqft: m?.sqft ?? qi?.sqft,
    floorTypes: {
      carpet: m?.floorTypes?.carpet ?? qi?.floorTypes?.carpet,
      hardfloor: m?.floorTypes?.hardfloor ?? qi?.floorTypes?.hardfloor,
    },
    frequency: (qi?.frequency as any) || '',
    selectedPackage: selectedPackageName,
  };
}

export default function FormSummaryCard({ data, currentStep }: FormSummaryCardProps) {
  const vm: ViewModel = isBackendQuote(data) ? fromBackend(data) : isUIQuoteInfo(data) ? fromUI(data) : {};

  console.log(vm.selectedPackage)
  console.log(data)
  const formatCurrency = (amount?: number) => {
    return typeof amount === 'number' && !Number.isNaN(amount) ? `$${amount.toLocaleString()}` : 'Not set';
  };

  const formatFloorTypes = () => {
    if (vm.floorTypes && (vm.floorTypes.hardfloor ?? vm.floorTypes.carpet) !== undefined) {
      const hard = vm.floorTypes.hardfloor ?? 0;
      const carp = vm.floorTypes.carpet ?? 0;
      return `${hard}% Hardfloor, ${carp}% Carpet`;
    }
    return 'Not set';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-[#001F54] mb-4 flex items-center">
        <div className="w-2 h-2 bg-[#F5C542] rounded-full mr-2" />
        Quote Summary
      </h3>

      <div className="space-y-4 text-sm">
        {/* Contact Info */}
        {currentStep > 1 && vm.contact?.firstName && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
            <div className="text-gray-600 space-y-1">
              <div>
                {vm.contact.firstName} {vm.contact.lastName}
              </div>
              {vm.contact.company && <div>{vm.contact.company}</div>}
              {vm.contact.email && <div>{vm.contact.email}</div>}
              {vm.contact.phone && <div>{vm.contact.phone}</div>}
            </div>
          </div>
        )}

        {/* Budget */}
        {currentStep > 2 && typeof vm.budget === 'number' && vm.budget > 0 && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Budget</h4>
            <div className="text-gray-600">{formatCurrency(vm.budget)}/month</div>
          </div>
        )}

        {/* Facility Type */}
        {currentStep > 3 && vm.facilityType && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Facility</h4>
            <div className="text-gray-600">{vm.facilityType}</div>
          </div>
        )}

        {/* Floors & Stairs */}
        {currentStep > 4 && (vm.floors ?? 0) > 0 && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Layout</h4>
            <div className="text-gray-600 space-y-1">
              <div>
                {vm.floors} floor{(vm.floors ?? 0) > 1 ? 's' : ''}
              </div>
              {(vm.stairwellsCarpeted ?? 0) > 0 && (
                <div>
                  {vm.stairwellsCarpeted} carpeted stairwell{(vm.stairwellsCarpeted ?? 0) > 1 ? 's' : ''}
                </div>
              )}
              {(vm.stairwellsHardfloor ?? 0) > 0 && (
                <div>
                  {vm.stairwellsHardfloor} hardfloor stairwell{(vm.stairwellsHardfloor ?? 0) > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Square Footage */}
        {currentStep > 5 && (vm.sqft ?? 0) > 0 && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Space</h4>
            <div className="text-gray-600 space-y-1">
              <div>{vm.sqft?.toLocaleString()} sq ft</div>
              <div>{formatFloorTypes()}</div>
            </div>
          </div>
        )}

        {/* Frequency */}
        {currentStep > 6 && vm.frequency && (
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Frequency</h4>
            <div className="text-gray-600">{vm.frequency}</div>
          </div>
        )}

        {/* Package */}
        {currentStep > 7 && vm.selectedPackage && (
          <div className="pb-3">
            <h4 className="font-medium text-gray-900 mb-2">Package</h4>
            <div className="text-gray-600">
              {typeof vm.selectedPackage === 'string'
                ? vm.selectedPackage
                : 'Selected'}
            </div>
          </div>
        )}
      </div>

      {currentStep <= 2 && (
        <div className="text-gray-500 text-sm italic">Complete steps to see your quote summary</div>
      )}
    </div>
  );
}
