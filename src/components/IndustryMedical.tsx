'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const MedicalPage: React.FC = () => {
    return (
        <IndustryPage
            name="Medical"
            image="/images/medical.jpeg"
            blurb="In medical facilities, cleanliness isn't just important—it's essential. JanFinder connects you with professional cleaning companies that specialize in maintaining the highest standards of sanitation and hygiene. Create a safe and welcoming environment for your patients and staff with expertly tailored cleaning solutions."
        />
    );
};

export default MedicalPage;
