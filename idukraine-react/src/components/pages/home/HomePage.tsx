import { useEffect, useState } from 'react';
import HeroSection from './Hero/HeroSection';
import AboutSection from './About/AboutSection';
import AreasSection from './Areas/Areas';
import GeneralNewsSection from './GeneralNews/GeneralNewsSection';
import TeamSection from './Team/TeamSection';
import ContactUsSection from './ContactUs/ContactUsSection';
import TopNewsSection from './TopNews/TopNews';
import SplashScreen from './common/SplashScreen';

function HomePage() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('hasSeenSplash');
  });
  const [isSplashFading, setIsSplashFading] = useState(false);

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, [showSplash]);

  useEffect(() => {
    if (showSplash && !isSplashFading) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Очищення при демонтуванні
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showSplash, isSplashFading]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setIsSplashFading(false);
  };

  const handleFadeStart = () => {
    setIsSplashFading(true);
  };

  return (
    <div
      className={`home-page ${
        showSplash && !isSplashFading ? 'splash-active' : ''
      }`}
    >
      {showSplash && (
        <SplashScreen
          onComplete={handleSplashComplete}
          onFadeStart={handleFadeStart}
        />
      )}
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <TopNewsSection />
      <GeneralNewsSection />
      <AreasSection />
      <ContactUsSection />
    </div>
  );
}

export default HomePage;
