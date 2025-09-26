import React from 'react';
import HeroSection from '../components/home/HeroSection';
import SolutionsOverview from '../components/home/SolutionsOverview';
import CoreServices from '../components/home/CoreServices';
import WhyLimitless from '../components/home/WhyLimitless';
import VideoDemoSection from '../components/home/VideoDemoSection-enhanced';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import Partners from '../components/home/Partners';
import Faq from '../components/home/Faq';
import FinalCta from '../components/home/FinalCta';

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <Partners />
      <SolutionsOverview />
      <CoreServices />
      <WhyLimitless />
      <VideoDemoSection />
      <TestimonialsCarousel />
      <Faq />
      <FinalCta />
    </>
  );
};

export default Home;
