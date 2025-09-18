'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { PackageOption } from '@/types/packages';

interface PackageCardProps {
  package: PackageOption;
  isSelected: boolean;
  onSelect: () => void;
  frequency: string;
  recType: string;
}

export default function PackageCard({
  package: pkg,
  isSelected,
  onSelect,
  frequency,
  recType,
}: PackageCardProps) {
  const getPackageGradient = (type: string) => {
    switch (type) {
      case 'bottom':
        return 'from-blue-50 to-blue-100';
      case 'middle':
        return 'from-yellow-50 to-yellow-100';
      case 'top':
        return 'from-purple-50 to-purple-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'bottom':
        return '✨';
      case 'middle':
        return '🌟';
      case 'top':
        return '👑';
      default:
        return '🧹';
    }
  };

  const getBulletPoints = (type: string) => {
    switch (type) {
      case 'bottom':
        return ['Basic cleaning essentials', 'Trash & recycling', 'Regular maintenance'];
      case 'middle':
        return ['Comprehensive cleaning', 'Deep carpet care', 'Window cleaning', 'Enhanced sanitization'];
      case 'top':
        return ['Premium service', 'Hospital-grade disinfection', 'Quality inspections', 'Complete facility care'];
      default:
        return [];
    }
  };

  const isRecommended = pkg.packageType === recType;

  // ✅ Safely narrow optional arrays for TS
  const carpetTasks = pkg.carpet?.tasks ?? [];
  const hardfloorTasks = pkg.hardfloor?.tasks ?? [];

  return (
    <div className="relative">
      {isRecommended && (
        // centered above the card
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span
            aria-label="Recommended package"
            className="inline-flex items-center justify-center rounded-full
                   bg-[#F5C542] text-[#001F54] px-4 py-1.5
                   text-[11px] font-extrabold uppercase tracking-wider
                   shadow-lg ring-2 ring-white/80"
          >
            Recommended
          </span>
        </div>
      )}

      {/* ⬇️ OUTER is now a DIV role=button (accessible), not a <button> */}
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${isSelected
          ? 'border-[#F5C542] ring-4 ring-[#F5C542]/20 shadow-xl scale-105'
          : 'border-gray-200 hover:border-[#F5C542]/50'
          } ${isRecommended ? 'pt-8' : ''}`}
      >
        <div className={`bg-gradient-to-br ${getPackageGradient(pkg.packageType)} rounded-lg p-6 mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getPackageIcon(pkg.packageType)}</span>
              <h3 className="text-xl font-bold text-[#001F54]">{pkg.packageName}</h3>
            </div>

            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-[#F5C542] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="text-center py-3 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-[#001F54] mb-1">
                ${pkg.packageCost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {frequency === 'One Time' ? 'One-time service' : 'per month'}
              </div>
              <div className="text-xs text-gray-500 mt-1">*Estimated pricing</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-[#001F54] mb-3">Key Features:</h4>
          {getBulletPoints(pkg.packageType).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-[#F5C542] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* ⬇️ Stop propagation so expanding the accordion doesn't select the card */}
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="services">
              <AccordionTrigger
                className="text-[#001F54] font-semibold"
              >
                See All Services
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {/* ROOM TASKS */}
                {pkg?.rooms?.map((room, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <h5 className="font-medium text-[#001F54] mb-2">{room.roomName}</h5>
                    <ul className="space-y-1">
                      {room.roomTasks?.map((task, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex justify-between items-center">
                          <span>{task.taskName}</span>
                          <span className="italic text-gray-500 text-xs">{task.frequency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* CARPET TASKS */}
                {carpetTasks.length > 0 && (
                  <div className="border-b border-gray-200 pb-3">
                    <h5 className="font-medium text-[#001F54] mb-2">Carpeted Areas</h5>
                    <ul className="space-y-1">
                      {carpetTasks.map((task, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex justify-between items-center">
                          <span>{task.taskName}</span>
                          <span className="italic text-gray-500 text-xs">{task.frequency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* HARDFLOOR TASKS */}
                {hardfloorTasks.length > 0 && (
                  <div className="pb-3">
                    <h5 className="font-medium text-[#001F54] mb-2">Hardfloor Areas</h5>
                    <ul className="space-y-1">
                      {hardfloorTasks.map((task, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex justify-between items-center">
                          <span>{task.taskName}</span>
                          <span className="italic text-gray-500 text-xs">{task.frequency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>

  );
}
