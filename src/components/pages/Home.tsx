'use client';

import React from 'react';
import GetQuoteHome from '../HomeGetQuote';
import HomeSteps from '../HomeSteps';
import Welcome from '../Welcome';
import HomeJanPics from '../HomeJanPics';
import HomeIndustry from '../HomeIndustry';
import HomeReviews from '../HomeReviews';
import HomeBusinessOwner from '../HomeBuisnessOwner';
import HomeMainImage from '../HomeMainImage';

function Home() {
  return (
    <div className="md:mt-24">
      {/* Home Main Image */}
      <HomeMainImage />

      {/* Welcome Section */}
      <div className="relative z-20">
        <Welcome />
      </div>

      {/* Other Sections */}
      <div className="relative z-20">
        <HomeSteps />
        <HomeReviews />
        <HomeJanPics />
        <HomeBusinessOwner />
        <HomeIndustry />
      </div>
    </div>
  );
}

export default Home;
