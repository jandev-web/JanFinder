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
    <div className='mt-24'>
      <HomeMainImage />
      <Welcome />
      <HomeSteps />
      <HomeReviews />
      <HomeJanPics />
      <HomeBusinessOwner />
      <HomeIndustry />
    </div>
  );
}

export default Home;
