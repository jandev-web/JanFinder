'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import getQuoteStatus from '@/utils/getQuoteStatus';
import QuoteStatusLoading from '@/components/QuoteStatusLoading';
import QuoteStatusFound from '@/components/QuoteStatusFound';
import QuoteStatusNotFound from '@/components/QuoteStatusNotFound';

const QuoteStatusQuote: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [quoteData, setQuoteData] = useState<any>(null);

  const email = searchParams.get('email');
  const confirmation = searchParams.get('con');

  useEffect(() => {
    if (!email || !confirmation) {
      router.push('/error');
      return;
    }

    const fetchQuoteStatus = async () => {
      const result = await getQuoteStatus(email, confirmation);

      if (result.error) {
        //router.push('/error');
      } else if (result.notFound) {
        setQuoteData(null); // No data for 404
      } else {
        setQuoteData(result.data); // Populate with found data
      }

      setLoading(false);
    };

    fetchQuoteStatus();
  }, [email, confirmation, router]);

  if (loading) {
    return <QuoteStatusLoading />;
  }

  if (!quoteData) {
    return <QuoteStatusNotFound />;
  }

  return <QuoteStatusFound quote={quoteData.data} />;
};

export default QuoteStatusQuote;
