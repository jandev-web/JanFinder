'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loadingScreen";
import type { QuoteInfo } from '@/types/quote-ui';
import { StartQuoteAction } from '@/utils/startQuoteClientAction'; // keep your path

interface CongratulationPageProps {
  data: any;
}

export default function CongratulationPage({ data }: CongratulationPageProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const startNewQuote = React.useCallback(() => {
    setLoading(true);
    StartQuoteAction({
      // Force a full page load so everything resets (React state, caches, etc.)
      push: (href: string) => {
        if (href && href !== window.location.href) {
          window.location.assign(href);     // navigate + hard reload
        } else {
          window.location.reload();         // hard reload current page
        }
      },
    });
  }, []);

  const goHome = React.useCallback(() => {
    router.push('/get-a-quote');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-[#F5C542] to-[#f0b90b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#001F54] mb-4">
            Quote Request Submitted Successfully!
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Thank you for choosing Bid2Clean! We've received your request for the{' '}
            <span className="font-semibold text-[#001F54]">{data.selectedPackage}</span> package
            and will contact you within 24 hours to schedule your facility assessment.
          </p>

          {/* Quote Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-[#001F54] mb-4 text-center">
              Your Quote Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium text-[#001F54]">{data.selectedName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Facility Type:</span>
                  <span className="font-medium text-[#001F54]">{data.facilityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Footage:</span>
                  <span className="font-medium text-[#001F54]">{data.sqft.toLocaleString()} sq ft</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium text-[#001F54]">{data.selectedCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium text-[#001F54]">{data.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rooms:</span>
                  <span className="font-medium text-[#001F54]">
                    {data.rooms.reduce((sum: any, room: any) => sum + room.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
            <h4 className="font-semibold text-[#001F54] mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#F5C542]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What Happens Next
            </h4>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#F5C542] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p>Our team will review your requirements and facility details</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#F5C542] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p>We'll contact you within 24 hours to schedule a facility walkthrough</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#F5C542] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p>Receive your detailed, customized cleaning proposal</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startNewQuote}
              className="px-8 py-3 bg-[#001F54] text-white rounded-xl font-semibold hover:bg-[#0a2d7a] transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Create Another Quote
            </button>

            <button
              onClick={goHome}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Return to Home
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Questions? Contact us at{' '}
              <a href="mailto:quotes@bid2clean.com" className="text-[#001F54] font-medium hover:text-[#0a2d7a]">
                quotes@bid2clean.com
              </a>{' '}
              or{' '}
              <a href="tel:+1-555-BID-CLEAN" className="text-[#001F54] font-medium hover:text-[#0a2d7a]">
                (555) BID-CLEAN
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}