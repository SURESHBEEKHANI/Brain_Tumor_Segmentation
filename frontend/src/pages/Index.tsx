
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import UploadSection from '@/components/UploadSection';
import ProcessingDashboard from '@/components/ProcessingDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <UploadSection />
      <ProcessingDashboard />
    </div>
  );
};

export default Index;
