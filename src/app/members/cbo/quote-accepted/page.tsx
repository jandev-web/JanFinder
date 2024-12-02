'use client'
import React from 'react';
import CBOHeader from '@/components/CBOHeader';
import { useUser } from '@/components/UserContext';

import { CBOQuoteAccepted } from "@/components";



function QuoteAcceptedPage() {
  const { attributes } = useUser();
  const user = attributes
  
  return (
    
        <div>
          <CBOHeader user={user} />
          <CBOQuoteAccepted/>
        </div>
      
  );
};
export default QuoteAcceptedPage;