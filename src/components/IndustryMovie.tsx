'use client';

import React from 'react';
import IndustryPage from '@/components/Industry';

const MovieTheaterPage: React.FC = () => {
    return (
        <IndustryPage
            name="Movie Theater"
            image="/images/movie-theater.jpeg"
            blurb="Create a cinematic experience that keeps audiences coming back. Bid2Clean connects you with expert cleaning services to ensure spotless seats, clean floors, and a fresh atmosphere in every theater and concession area."
        />
    );
};

export default MovieTheaterPage;
