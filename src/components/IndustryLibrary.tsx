'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const LibraryPage: React.FC = () => {
    return (
        <IndustryPage
            name="Library"
            image="/images/library.jpeg"
            blurb="Create a clean, quiet, and welcoming atmosphere for knowledge seekers and book lovers alike. JanFinder connects you with cleaning professionals who ensure your library stays immaculate, from reading rooms to research areas, for an exceptional visitor experience."
        />
    );
};

export default LibraryPage;
