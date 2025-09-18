'use client';

import React, { useEffect, useState } from 'react';
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
import FormSummaryCard from './FormSummaryCard';

import type { Quote } from '@/types/quotes';
import type { PackageOption, PackageChoice, PackageSet, CleaningFrequency } from '@/types/packages';
import type { Address } from '@/types/address';

import { updateCustomerInfo } from '@/utils/updateCustomerInfo';
import updateFloorInfo from '@/utils/updateFloorInfo';
import updateQuoteRooms from '@/utils/updateQuoteRooms';
import updateQuoteFrequency from '@/utils/updateQuoteFrequency';
import { clearPackages } from '@/utils/clearPackages';
import { updateQuoteBudget } from '@/utils/updateQuoteBudget';
import { changeFacilityType } from '@/utils/changeFacilityType';
import { updatePackageChoice } from '@/utils/updatePackageChoice';
import confirmQuote from '@/utils/confirmQuote'

import { getRoomsForFacility } from '@/data/facilityOptions';
import { calculateTime } from '@/utils/calculateTime';
import recPackageUtil from '@/utils/recPackageUtil';

import LoadingSpinner from '../loadingScreen';

import { useRouter } from 'next/navigation';

const TOTAL_STEPS = 8;
const EMPTY_CHOICE = '' as PackageChoice;

/** ---------------- UI-only types (form state) ---------------- */
type WizardContact = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;   // street
  city: string;
  state: string;
  postalCode: string;
};

type WizardRoom = { roomType: string; count: number };

type WizardForm = {
  contact: WizardContact;
  budget: number;
  facilityType: string;
  floors: number;
  stairwellsCarpeted: number;
  stairwellsHardfloor: number;
  sqft: number;
  floorTypePercentages: { hardfloor: number; carpet: number };
  rooms: WizardRoom[];
  frequency: CleaningFrequency;
  selectedPackage: PackageChoice;
  selectedCost: number;
  selectedName: string;
};

type ValidationErrors = Partial<Record<
  | 'firstName' | 'lastName' | 'company' | 'email' | 'phone' | 'address' | 'city' | 'state' | 'postalCode'
  | 'budget' | 'facilityType' | 'floors' | 'sqft' | 'rooms' | 'frequency' | 'selectedPackage',
  string
>>;
/** ----------------------------------------------------------- */

type Props = {
  quoteID?: string;
  initialQuote?: Partial<Quote>;
};

/** ---------- Defaults that satisfy required nested types ---------- */
const DEFAULT_QUOTE_INFO: Quote['quoteInfo'] = {
  budget: 0,
  facilityType: '',
  floorTypes: { hardfloor: 0, carpet: 0 },
  floors: 1,
  frequency: '',
  roomTypes: [],
  sqft: 0,
  stairwells: { carpet: 0, hardfloor: 0 },
};

const DEFAULT_CUSTOMER_DATA: Quote['customerData'] = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  address: { street: '', city: '', state: '', postalCode: '', country: '' },
};

// NOTE: use PackageSet here so `packageChoice` is part of the shape.
const DEFAULT_PACKAGE: PackageSet = { packageOptions: [] };

/** ---------- Mergers that always return fully-typed objects ---------- */
function withQuoteInfo(
  prev: Partial<Quote> | undefined,
  patch: Partial<Quote['quoteInfo']>
): Quote['quoteInfo'] {
  return { ...(prev?.quoteInfo ?? DEFAULT_QUOTE_INFO), ...patch };
}

function withCustomerData(
  prev: Partial<Quote> | undefined,
  patch: Partial<Quote['customerData']>
): Quote['customerData'] {
  return {
    ...(prev?.customerData ?? DEFAULT_CUSTOMER_DATA),
    ...patch,
    address: {
      ...((prev?.customerData?.address) ?? DEFAULT_CUSTOMER_DATA.address),
      ...(patch.address ?? {}),
    },
  };
}

// Accept a Partial<PackageSet> so `packageChoice` patches type-check.
function withPackage(
  prev: Partial<Quote> | undefined,
  patch: Partial<PackageSet>
): PackageSet {
  return { ...(prev?.package ?? DEFAULT_PACKAGE), ...patch };
}

export default function QuoteWizard({ quoteID, initialQuote }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialForm, setInitialForm] = useState<Partial<Quote> | undefined>(initialQuote);
  const [roomOptions, setRoomOptions] = useState<any>(null);
  const [recType, setRecType] = useState<any>(null);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [formData, setFormData] = useState<WizardForm>({
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
    selectedPackage: EMPTY_CHOICE,
    selectedCost: 0,
    selectedName: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(TOTAL_STEPS).fill(false)
  );

  function getSelectedInfo(
    options: PackageOption[] | undefined,
    choice: PackageChoice | '' | null
  ): { packageCost?: number; packageName?: string } {
    const choiceStr = (choice ?? '').toString().trim();
    if (!options?.length || !choiceStr) return {};

    const hit = options.find(o => o.packageType === choiceStr);

    return {
      packageCost:
        hit && typeof hit.packageCost === 'number' && !Number.isNaN(hit.packageCost)
          ? hit.packageCost
          : undefined,
      packageName:
        hit && typeof hit.packageName === 'string' && hit.packageName.trim().length > 0
          ? hit.packageName
          : undefined,
    };
  }



  /** ---------- Builders for payloads used by your utils ---------- */
  function buildCustomerInfoPayload() {
    const addr: Address = {
      street: formData.contact.address.trim(),
      city: formData.contact.city.trim(),
      state: formData.contact.state.trim().toUpperCase(),
      postalCode: formData.contact.postalCode.trim(),
      country: 'USA',
    };
    return {
      firstName: formData.contact.firstName.trim(),
      lastName: formData.contact.lastName.trim(),
      email: formData.contact.email.trim().toLowerCase(),
      phone: formData.contact.phone.trim(),
      company: formData.contact.company.trim(),
      address: addr,
    };
  }

  function buildFloorInfoPayload() {
    return {
      floors: Number(formData.floors || 0),
      stairwells: {
        carpet: Number(formData.stairwellsCarpeted || 0),
        hardfloor: Number(formData.stairwellsHardfloor || 0),
      },
    };
  }

  function buildRoomsPayload() {
    return {
      sqft: Number(formData.sqft || 0),
      roomTypes: formData.rooms, // [{ roomType, count }]
      floorTypes: {
        hardfloor: Number(formData.floorTypePercentages.hardfloor || 0),
        carpet: Number(formData.floorTypePercentages.carpet || 0),
      },
    };
  }

  /** ---------- Diff check vs initialForm (server shape) ---------- */
  function mapInitialToForm(q: Partial<Quote> | undefined): WizardForm {
    const cd = q?.customerData;
    const qi = q?.quoteInfo as any;
    const pkg = q?.package ?? DEFAULT_PACKAGE;

    const sp = (pkg?.packageChoice ?? EMPTY_CHOICE) as PackageChoice;

    // find the cost of the option whose type matches the selected package (sp)
    const hit = pkg?.packageOptions?.find(opt => opt.packageType === sp);
    const scRaw = hit?.packageCost;
    const snRaw = hit?.packageName;

    const sc = (typeof scRaw === 'number' && !Number.isNaN(scRaw)) ? scRaw : undefined;
    const sn = (typeof snRaw === 'string' && snRaw.trim() !== '') ? snRaw : undefined;

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
      facilityType: qi?.facilityType ?? '',
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
      selectedPackage: sp,
      selectedCost: sc ?? 0,
      selectedName: sn ?? '',
    };
  }


  function stepChanged(): boolean {
    const prev = mapInitialToForm(initialForm);
    switch (currentStep) {
      case 1:
        return JSON.stringify(prev.contact) !== JSON.stringify(formData.contact);
      case 2:
        return prev.budget !== formData.budget;
      case 3:
        return prev.facilityType !== formData.facilityType;
      case 4:
        return (
          prev.floors !== formData.floors ||
          prev.stairwellsCarpeted !== formData.stairwellsCarpeted ||
          prev.stairwellsHardfloor !== formData.stairwellsHardfloor
        );
      case 5:
        return (
          prev.sqft !== formData.sqft ||
          JSON.stringify(prev.floorTypePercentages) !== JSON.stringify(formData.floorTypePercentages) ||
          JSON.stringify(prev.rooms) !== JSON.stringify(formData.rooms)
        );
      case 6:
        return prev.frequency !== formData.frequency;
      case 7:
        console.log(prev.selectedPackage)
        console.log(prev.selectedPackage)
        return prev.selectedPackage !== formData.selectedPackage;

      default:
        return false;
    }
  }

  // Helper: do we have any values set in steps 4–7?
  function hasPostFacilityValues(f: WizardForm): boolean {
    const hasRooms = Array.isArray(f.rooms) && f.rooms.some((r) => (r?.count ?? 0) > 0);
    const hasFloorTypes =
      (Number(f.floorTypePercentages.hardfloor) || 0) > 0 ||
      (Number(f.floorTypePercentages.carpet) || 0) > 0;
    const hasStairwells =
      (Number(f.stairwellsCarpeted) || 0) > 0 || (Number(f.stairwellsHardfloor) || 0) > 0;

    return (
      (Number(f.floors) || 0) !== 1 ||
      hasStairwells ||
      (Number(f.sqft) || 0) > 0 ||
      hasRooms ||
      hasFloorTypes ||
      (f.frequency?.trim()?.length ?? 0) > 0 ||
      (f.selectedPackage?.trim()?.length ?? 0) > 0
    );
  }

  /** ---------- Persist current step (uses new canonical payloads) ---------- */
  async function persistCurrentStep() {
    if (!quoteID) {
      console.error('No quoteID provided');
      return;
    }
    if (!stepChanged()) return;

    setIsSaving(true);
    try {
      switch (currentStep) {
        case 1: {
          // CONTACT
          const c = buildCustomerInfoPayload();
          await updateCustomerInfo(
            quoteID,
            c.firstName, c.lastName, c.email, c.phone, c.company, c.address
          );

          setInitialForm((prev) => ({
            ...(prev ?? {}),
            customerData: withCustomerData(prev, {
              firstName: c.firstName,
              lastName: c.lastName,
              email: c.email,
              phone: c.phone,
              company: c.company,
              address: c.address,
            }),
            email: c.email,
          }));
          break;
        }

        case 2: {
          // BUDGET
          const budget = Number(formData.budget || 0);
          await updateQuoteBudget(quoteID, budget);

          const options = initialForm?.package?.packageOptions ?? [];
          if (Array.isArray(options) && options.length > 0) {
            const newRecPackage = recPackageUtil(options, budget);
            setRecType(newRecPackage);
          }

          setInitialForm((prev) => ({
            ...(prev ?? {}),
            quoteInfo: withQuoteInfo(prev, { budget }),
          }));
          break;
        }

        case 3: {
          // FACILITY TYPE
          const facilityType = formData.facilityType;
          await changeFacilityType(quoteID, facilityType);

          if (hasPostFacilityValues(formData)) {
            const resetFloors = updateFloorInfo(quoteID, {
              floors: 1,
              stairwells: { carpet: 0, hardfloor: 0 },
            });
            const resetRooms = updateQuoteRooms(quoteID, {
              sqft: 0,
              roomTypes: [],
              floorTypes: { hardfloor: 0, carpet: 0 },
            });
            const resetFrequency = updateQuoteFrequency(quoteID, '');
            const resetPackage = clearPackages(quoteID);
            await Promise.all([resetFloors, resetRooms, resetFrequency, resetPackage]);
          }

          setInitialForm((prev) => ({
            ...(prev ?? {}),
            quoteInfo: withQuoteInfo(prev, {
              facilityType,
              floors: 1,
              stairwells: { carpet: 0, hardfloor: 0 },
              sqft: 0,
              roomTypes: [],
              floorTypes: { hardfloor: 0, carpet: 0 },
              frequency: '',
              budget: prev?.quoteInfo?.budget ?? 0,
            }),
            // Keep types strict for Package and allow clearing selection
            package: withPackage(prev, { packageChoice: null }),
          }));

          setFormData((p) => ({
            ...p,
            facilityType,
            floors: 1,
            stairwellsCarpeted: 0,
            stairwellsHardfloor: 0,
            sqft: 0,
            rooms: [],
            floorTypePercentages: { hardfloor: 0, carpet: 0 },
            frequency: '',
            selectedPackage: EMPTY_CHOICE,
            selectedCost: 0,
          }));

          setRecType(null);
          setRoomOptions(getRoomsForFacility(facilityType));
          break;
        }

        case 4: {
          // FLOORS / STAIRWELLS
          const payload = buildFloorInfoPayload();
          await updateFloorInfo(quoteID, payload);

          setInitialForm((prev) => ({
            ...(prev ?? {}),
            quoteInfo: withQuoteInfo(prev, {
              floors: payload.floors,
              stairwells: payload.stairwells,
            }),
          }));
          break;
        }

        case 5: {
          // ROOMS / SQFT / FLOOR TYPES
          const payload = buildRoomsPayload();
          await updateQuoteRooms(quoteID, payload);

          setInitialForm((prev) => ({
            ...(prev ?? {}),
            quoteInfo: withQuoteInfo(prev, {
              sqft: payload.sqft,
              roomTypes: payload.roomTypes,
              floorTypes: payload.floorTypes,
            }),
          }));
          break;
        }

        case 6: {
          // FREQUENCY + recompute packages
          const frequency: CleaningFrequency = formData.frequency;
          await updateQuoteFrequency(quoteID, frequency);

          const calc = await calculateTime(quoteID);
          const options: PackageOption[] = (calc?.packageOptions ?? []) as PackageOption[];
          setPackages(options);

          if (Array.isArray(options) && options.length > 0) {
            const newRecPackage = recPackageUtil(options, formData.budget);
            setRecType(newRecPackage);
          }

          setInitialForm((prev) => ({
            ...(prev ?? {}),
            quoteInfo: withQuoteInfo(prev, { frequency }),
            package: withPackage(prev, { packageOptions: options }),
          }));
          break;
        }

        case 7: {
          // PACKAGE CHOICE
          // Keep UI state strictly a string; only send null to backend if empty.
          const raw = formData.selectedPackage ?? '';
          const choiceForDb: PackageChoice | null = raw.trim() ? raw : null;

          const allPackageOptions = initialForm?.package?.packageOptions
          const newPackageInfo = getSelectedInfo(allPackageOptions, choiceForDb ?? EMPTY_CHOICE)
          const newCost = newPackageInfo?.packageCost ?? 0;
          const newName = newPackageInfo?.packageName ?? '';
          await updatePackageChoice(quoteID, choiceForDb ?? EMPTY_CHOICE);

          setInitialForm((prev) => ({
            ...(prev ?? {}),
            package: withPackage(prev, { packageChoice: choiceForDb }),
          }));

          console.log(choiceForDb)

          // UI state must be a string (PackageChoice), never null
          setFormData((p) => ({
            ...p,
            selectedPackage: choiceForDb ?? EMPTY_CHOICE,
            selectedCost: newCost ?? 0,
            selectedName: newName ?? 0,
          }));
          break;
        }


        default:
          break;
      }
    } finally {
      setIsSaving(false);
    }
  }

  /** ---------- Hydrate from initialQuote on mount or change ---------- */
  useEffect(() => {
    if (!initialForm) return;
    console.log(initialForm)
    const mapped = mapInitialToForm(initialForm);
    console.log(mapped)
    setFormData(mapped);

    if (initialForm?.quoteInfo?.facilityType) {
      const newRoomOptions = getRoomsForFacility(initialForm.quoteInfo.facilityType);
      setRoomOptions(newRoomOptions);
    }

    const opts: PackageOption[] = initialForm?.package?.packageOptions ?? [];
    console.log(opts)
    if (Array.isArray(opts) && opts.length) {
      setPackages(opts);
      const newRecPackage = recPackageUtil(opts, mapped.budget);
      console.log(newRecPackage)
      setRecType(newRecPackage);
    }

    const gates = deriveCompletedStepsFrom(mapped);
    setCompletedSteps(gates);

    const firstIncomplete = gates.findIndex((g) => g === false);
    setCurrentStep(firstIncomplete === -1 ? TOTAL_STEPS : firstIncomplete + 1);

    setErrors({});
    setLoading(false)
  }, [initialForm]);

  function deriveCompletedStepsFrom(form: WizardForm): boolean[] {
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

    if (form.budget && form.budget > 0) { done[1] = true; } else { return done; }
    if (form.facilityType) { done[2] = true; } else { return done; }
    if (form.floors && form.floors >= 1) { done[3] = true; } else { return done; }

    const roomsOk = Array.isArray(form.rooms) && form.rooms.some((r) => (r?.count ?? 0) > 0);
    if (form.sqft > 0 && roomsOk) { done[4] = true; } else { return done; }

    if (form.frequency) { done[5] = true; } else { return done; }
    if (form.selectedPackage) { done[6] = true; } else { return done; }

    done[7] = true;
    return done;
  }

  /** ---------- Validation (unchanged) ---------- */
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
      case 1: stepErrors = validateContact(); break;
      case 2: stepErrors = validateBudget(); break;
      case 3: stepErrors = validateFacilityType(); break;
      case 4: stepErrors = validateFloorsStairs(); break;
      case 5: stepErrors = validateSqftRooms(); break;
      case 6: stepErrors = validateFrequency(); break;
      case 7: stepErrors = validatePackage(); break;
      case 8: break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  /** ---------- Navigation ---------- */
  const handleNext = async () => {
    if (!validateCurrentStep()) return;
    try {
      await persistCurrentStep();
    } catch (e) {
      console.error('Persist failed:', e);
    }
    const next = [...completedSteps];
    next[currentStep - 1] = true;
    setCompletedSteps(next);
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    setErrors({});
  };

  const handleStepClick = async (step: number) => {
    const canGoForwardOne = step === currentStep + 1 && validateCurrentStep();
    const canGo = completedSteps[step - 1] || canGoForwardOne;

    if (canGo && step <= TOTAL_STEPS) {
      if (canGoForwardOne) {
        try {
          await persistCurrentStep();
        } catch (e) {
          console.error('Persist failed:', e);
        }
        const next = [...completedSteps];
        next[currentStep - 1] = true;
        setCompletedSteps(next);
      }
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    
    if (!validateCurrentStep()) return;
    if (!quoteID) return;
    setIsSubmitting(true);
    await confirmQuote(quoteID);
    setLoading(true)
    router.push(`/get-a-quote/congratulations?qid=${encodeURIComponent(quoteID)}`)
    setIsSubmitting(false);
  };

  /** ---------- Change handlers (unchanged) ---------- */
  const updateContact = (contact: WizardForm['contact']) =>
    setFormData((p) => ({ ...p, contact }));
  const updateBudget = (budget: number) =>
    setFormData((p) => ({ ...p, budget }));
  const updateFacilityType = (facilityType: WizardForm['facilityType']) =>
    setFormData((p) => ({ ...p, facilityType }));
  const updateFloorsStairs = (data: {
    floors: number;
    stairwellsCarpeted: number;
    stairwellsHardfloor: number;
  }) => setFormData((p) => ({ ...p, ...data }));
  const updateSqftRooms = (data: {
    sqft: number;
    floorTypePercentages: WizardForm['floorTypePercentages'];
    rooms: WizardForm['rooms'];
  }) => setFormData((p) => ({ ...p, ...data }));
  const updateFrequency = (frequency: WizardForm['frequency']) =>
    setFormData((p) => ({ ...p, frequency }));
  const updatePackage = (selectedPackage: WizardForm['selectedPackage']) =>
    setFormData((p) => ({ ...p, selectedPackage }));


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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
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
                    roomOptions={roomOptions}
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
                    recType={recType}
                    packages={packages}
                    errors={errors}
                    sqft={formData.sqft}
                    frequency={formData.frequency}
                  />
                )}
                {currentStep === 8 && <ReviewStep data={formData} packageOptions={initialForm?.package?.packageOptions} />}
              </div>

              <StepControls
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isValid={Object.keys(errors).length === 0}
                isSubmitting={isSubmitting}
                isSaving={isSaving}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <FormSummaryCard data={formData} currentStep={currentStep} packageOptions={initialForm?.package?.packageOptions} />
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
