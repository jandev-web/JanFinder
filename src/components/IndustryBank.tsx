'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const BankPage: React.FC = () => {
    return (
        <IndustryPage
            name="Banks"
            image="/images/bank.jpeg"
            blurb="In the financial world, trust and professionalism start with a clean and polished environment. Bid2Clean helps you connect with expert cleaning companies that ensure your bank branches maintain a pristine appearance, creating a welcoming space for clients and employees alike."
        />
    );
};

export default BankPage;
