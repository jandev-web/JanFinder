'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const RetailPage: React.FC = () => {
    return (
        <IndustryPage
            name="Retail"
            image="/images/retail.jpeg"
            blurb="A clean and well-maintained retail space enhances your customers' shopping experience and keeps them coming back for more. With Bid2Clean, you can easily connect with professional cleaning companies that specialize in retail spaces, ensuring your store always looks its best."
        />
    );
};

export default RetailPage;
