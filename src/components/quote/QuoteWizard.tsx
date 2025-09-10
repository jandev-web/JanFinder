'use client';

import React, { useEffect, useMemo, useState } from 'react';
import StepHeader from './StepHeader';
import StepControls from './StepControls';
import ContactStep from './steps/ContactStep';
import BudgetStep from './steps/BudgetStep';
import FacilityTypeStep from './steps/FacilityTypeStep';
import FloorsStairsStep from './steps/FloorsStairsStep';
import SqftRoomsStep from './steps/SqftRoomsStep';
import FrequencyStep from './steps/FrequencyStep';
import PackageStep from './steps/PackageStep';
import ReviewStep from './steps/ReviewStep';
import CongratsPanel from './CongratsPanel';
import FormSummaryCard from './FormSummaryCard';
import { QuoteInfo, ValidationErrors } from './types';
import type { DBQuote } from '@/types/quote-db';

const TOTAL_STEPS = 8;

type Props = {
  quoteID?: string;
  initialQuote?: Partial<DBQuote>;
};


export default function QuoteWizard({ quoteID, initialQuote }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const [formData, setFormData] = useState<QuoteInfo>({
    contact: {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
    },
    budget: 0,
    facilityType: '',
    floors: 1,
    stairwellsCarpeted: 0,
    stairwellsHardfloor: 0,
    sqft: 0,
    floorTypePercentages: { hardfloor: 50, carpet: 50 },
    rooms: [],
    frequency: '',
    selectedPackage: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(TOTAL_STEPS).fill(false)
  );

  /** ---------- Helpers to translate initialQuote ---------- */
  function mapInitialToForm(q: Partial<DBQuote> | undefined): QuoteInfo {
    const cd = q?.customerData;
    const qi = q?.quoteInfo;
    const pkg = q?.Package;

    return {
      contact: {
        firstName: cd?.firstName ?? '',
        lastName: cd?.lastName ?? '',
        company: cd?.company ?? '',
        email: cd?.email ?? '',
        phone: cd?.phone ?? '',
        address: cd?.address?.street ?? '',
        city: cd?.address?.city ?? '',
        state: cd?.address?.state ?? '',
        postalCode: cd?.address?.postalCode ?? '',
      },
      budget: Number(qi?.budget ?? 0),
      facilityType: qi?.facilityType ?? "",
      floors: Number(qi?.floors ?? 1),
      stairwellsCarpeted: Number(qi?.stairwells?.carpet ?? 0),
      stairwellsHardfloor: Number(qi?.stairwells?.hardfloor ?? 0),
      sqft: Number(qi?.sqft ?? 0),
      floorTypePercentages: {
        hardfloor: Number(qi?.floorTypes?.hardfloor ?? 0),
        carpet: Number(qi?.floorTypes?.carpet ?? 0),
      },
      rooms: Array.isArray(qi?.roomTypes) ? qi!.roomTypes : [],
      frequency: qi?.frequency ?? '',
      selectedPackage: (pkg?.packageChoice ?? '') as any,
    };
  }

  function deriveCompletedStepsFrom(form: QuoteInfo): boolean[] {
    // Mirrors the gating logic from CustomerGetQuoteForm:
    // 1 Contact -> 2 Budget -> 3 Facility -> 4 Floors/Stairs -> 5 Rooms/Sqft
    // -> 6 Frequency -> 7 Package -> 8 Review
    const done = new Array(TOTAL_STEPS).fill(false);

    const contactValid =
      !!form.contact.firstName &&
      !!form.contact.lastName &&
      !!form.contact.email &&
      !!form.contact.phone &&
      !!form.contact.company &&
      !!form.contact.address &&
      !!form.contact.city &&
      !!form.contact.state &&
      !!form.contact.postalCode;
    if (!contactValid) return done;
    done[0] = true;

    if (form.budget && form.budget > 0) {
      done[1] = true;
    } else {
      return done;
    }

    if (form.facilityType) {
      done[2] = true;
    } else {
      return done;
    }

    if (form.floors && form.floors >= 1) {
      done[3] = true;
    } else {
      return done;
    }

    const roomsOk = Array.isArray(form.rooms) && form.rooms.some((r) => (r?.count ?? 0) > 0);
    if (form.sqft > 0 && roomsOk) {
      done[4] = true;
    } else {
      return done;
    }

    if (form.frequency) {
      done[5] = true;
    } else {
      return done;
    }

    if (form.selectedPackage) {
      done[6] = true;
    } else {
      return done;
    }

    // Step 8 (Review) is reachable if prior steps complete
    done[7] = true;
    return done;
  }

  /** ---------- Hydrate from initialQuote on mount or change ---------- */
  useEffect(() => {
    if (!initialQuote) return;
    const mapped = mapInitialToForm(initialQuote);
    setFormData(mapped);

    const gates = deriveCompletedStepsFrom(mapped);
    setCompletedSteps(gates);

    // Place the user on the first *incomplete* step, or Review if all complete
    const firstIncomplete = gates.findIndex((g) => g === false);
    setCurrentStep(firstIncomplete === -1 ? TOTAL_STEPS : firstIncomplete + 1);

    // Clear any previous errors
    setErrors({});
  }, [initialQuote]);

  /** ---------- Validation (same as your current code) ---------- */
  const validateContact = () => {
    const newErrors: ValidationErrors = {};
    const { contact } = formData;

    if (!contact.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!contact.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!contact.company.trim()) newErrors.company = 'Company name is required';
    if (!contact.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contact.email)) newErrors.email = 'Invalid email format';
    if (!contact.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!contact.address.trim()) newErrors.address = 'Street address is required';
    if (!contact.city.trim()) newErrors.city = 'City is required';
    if (!contact.state.trim()) newErrors.state = 'State is required';
    if (!contact.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    return newErrors;
  };

  const validateBudget = () => {
    const newErrors: ValidationErrors = {};
    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = 'Please enter a valid budget amount';
    }
    return newErrors;
  };

  const validateFacilityType = () => {
    const newErrors: ValidationErrors = {};
    if (!formData.facilityType) {
      newErrors.facilityType = 'Please select a facility type';
    }
    return newErrors;
  };

  const validateFloorsStairs = () => {
    const newErrors: ValidationErrors = {};
    if (!formData.floors || formData.floors < 1) {
      newErrors.floors = 'Number of floors must be at least 1';
    }
    return newErrors;
  };

  const validateSqftRooms = () => {
    const newErrors: ValidationErrors = {};
    if (!formData.sqft || formData.sqft <= 0) {
      newErrors.sqft = 'Please enter a valid square footage';
    }
    if (!formData.rooms.length || formData.rooms.every((room) => (room.count ?? 0) <= 0)) {
      newErrors.rooms = 'Please select at least one room type with a quantity of 1 or more';
    }
    return newErrors;
  };

  const validateFrequency = () => {
    const newErrors: ValidationErrors = {};
    if (!formData.frequency) {
      newErrors.frequency = 'Please select a cleaning frequency';
    }
    return newErrors;
  };

  const validatePackage = () => {
    const newErrors: ValidationErrors = {};
    if (!formData.selectedPackage) {
      newErrors.selectedPackage = 'Please select a cleaning package';
    }
    return newErrors;
  };

  const validateCurrentStep = () => {
    let stepErrors: ValidationErrors = {};
    switch (currentStep) {
      case 1:
        stepErrors = validateContact();
        break;
      case 2:
        stepErrors = validateBudget();
        break;
      case 3:
        stepErrors = validateFacilityType();
        break;
      case 4:
        stepErrors = validateFloorsStairs();
        break;
      case 5:
        stepErrors = validateSqftRooms();
        break;
      case 6:
        stepErrors = validateFrequency();
        break;
      case 7:
        stepErrors = validatePackage();
        break;
      case 8:
        break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  /** ---------- Navigation ---------- */
  const handleNext = () => {
    if (validateCurrentStep()) {
      const next = [...completedSteps];
      next[currentStep - 1] = true;
      setCompletedSteps(next);
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    setErrors({});
  };

  const handleStepClick = (step: number) => {
    const canGo =
      completedSteps[step - 1] ||
      step <= currentStep + (validateCurrentStep() ? 1 : 0);
    if (canGo && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // mock
    setIsSubmitting(false);
    setShowCongrats(true);
  };

  /** ---------- Change handlers (unchanged) ---------- */
  const updateContact = (contact: QuoteInfo['contact']) =>
    setFormData((p) => ({ ...p, contact }));
  const updateBudget = (budget: number) =>
    setFormData((p) => ({ ...p, budget }));
  const updateFacilityType = (facilityType: QuoteInfo['facilityType']) =>
    setFormData((p) => ({ ...p, facilityType }));
  const updateFloorsStairs = (data: {
    floors: number;
    stairwellsCarpeted: number;
    stairwellsHardfloor: number;
  }) => setFormData((p) => ({ ...p, ...data }));
  const updateSqftRooms = (data: {
    sqft: number;
    floorTypePercentages: QuoteInfo['floorTypePercentages'];
    rooms: QuoteInfo['rooms'];
  }) => setFormData((p) => ({ ...p, ...data }));
  const updateFrequency = (frequency: QuoteInfo['frequency']) =>
    setFormData((p) => ({ ...p, frequency }));
  const updatePackage = (selectedPackage: QuoteInfo['selectedPackage']) =>
    setFormData((p) => ({ ...p, selectedPackage }));

  /** ---------- Congrats handling ---------- */
  const resetWizard = () => {
    setCurrentStep(1);
    setShowCongrats(false);
    setErrors({});
    setCompletedSteps(new Array(TOTAL_STEPS).fill(false));
    setFormData({
      contact: {
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
      },
      budget: 0,
      facilityType: '',
      floors: 1,
      stairwellsCarpeted: 0,
      stairwellsHardfloor: 0,
      sqft: 0,
      floorTypePercentages: { hardfloor: 50, carpet: 50 },
      rooms: [],
      frequency: '',
      selectedPackage: '',
    });
  };

  const getStepTitle = () => {
    const titles = [
      'Contact Information',
      'Budget Planning',
      'Facility Type',
      'Floors & Stairwells',
      'Square Footage & Rooms',
      'Cleaning Frequency',
      'Service Package',
      'Review & Submit',
    ];
    return titles[currentStep - 1];
  };

  const getStepSubtitle = () => {
    const subtitles = [
      "Tell us how to reach you and where you're located",
      'Help us understand your budget expectations',
      'What type of facility do you need cleaned?',
      'Tell us about your building layout',
      'Provide details about your space and room types',
      'How often do you need cleaning services?',
      'Choose the service level that fits your needs',
      'Review your information before submitting',
    ];
    return subtitles[currentStep - 1];
  };

  if (showCongrats) {
    return (
      <CongratsPanel
        data={formData}
        onNewQuote={resetWizard}
        onReturnHome={resetWizard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001F54]">
                <span className="text-lg font-bold text-white">B2C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#001F54]">Bid2Clean</h1>
                <div className="h-1 w-16 rounded-full bg-[#F5C542]" />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Quote #{quoteID ?? '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
              <StepHeader
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                title={getStepTitle()}
                subtitle={getStepSubtitle()}
                onStepClick={handleStepClick}
                completedSteps={completedSteps}
              />

              <div className="min-h-[500px]">
                {currentStep === 1 && (
                  <ContactStep
                    data={formData.contact}
                    onChange={updateContact}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <BudgetStep
                    budget={formData.budget}
                    onChange={updateBudget}
                    errors={errors}
                  />
                )}
                {currentStep === 3 && (
                  <FacilityTypeStep
                    facilityType={formData.facilityType}
                    onChange={updateFacilityType}
                    errors={errors}
                  />
                )}
                {currentStep === 4 && (
                  <FloorsStairsStep
                    floors={formData.floors}
                    stairwellsCarpeted={formData.stairwellsCarpeted}
                    stairwellsHardfloor={formData.stairwellsHardfloor}
                    onChange={updateFloorsStairs}
                    errors={errors}
                  />
                )}
                {currentStep === 5 && (
                  <SqftRoomsStep
                    sqft={formData.sqft}
                    floorTypePercentages={formData.floorTypePercentages}
                    rooms={formData.rooms}
                    onChange={updateSqftRooms}
                    errors={errors}
                  />
                )}
                {currentStep === 6 && (
                  <FrequencyStep
                    frequency={formData.frequency}
                    onChange={updateFrequency}
                    errors={errors}
                  />
                )}
                {currentStep === 7 && (
                  <PackageStep
                    selectedPackage={formData.selectedPackage}
                    onChange={updatePackage}
                    errors={errors}
                    sqft={formData.sqft}
                    frequency={formData.frequency}
                  />
                )}
                {currentStep === 8 && <ReviewStep data={formData} />}
              </div>

              <StepControls
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isValid={Object.keys(errors).length === 0}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <FormSummaryCard data={formData} currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-sm text-gray-500">
        <p>© 2024 Bid2Clean. Professional cleaning services you can trust.</p>
      </div>
    </div>
  );
}
