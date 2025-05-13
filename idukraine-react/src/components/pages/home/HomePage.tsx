import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import HeroSection from './Hero/HeroSection';
import AboutSection from './About/AboutSection';
import AreasSection from './Areas/Areas';
import GeneralNewsSection from './GeneralNews/GeneralNewsSection';
import TeamSection from './Team/TeamSection';
import ContactUsSection from './ContactUs/ContactUsSection';
import TopNewsSection from './TopNews/TopNews';
import SplashScreen from './common/SplashScreen';

type ContextType = {
  onSplashComplete: () => void;
};

function HomePage() {
  const { onSplashComplete } = useOutletContext<ContextType>();
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('hasSeenSplash');
  });
  const [isSplashFading, setIsSplashFading] = useState(false);
  const [splashComplete, setSplashComplete] = useState(!showSplash);

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem('hasSeenSplash', 'true');
      // Reset splash complete state when splash is shown
      setSplashComplete(false);
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

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showSplash, isSplashFading]);

  const handleFadeStart = () => {
    setIsSplashFading(true);
    // Start the animations when fade begins
    setSplashComplete(true);
    onSplashComplete();
  };

  const handleSplashComplete = () => {
    // Remove the splash screen component after fade animation completes
    setTimeout(() => {
      setShowSplash(false);
      setIsSplashFading(false);
    }, 900); // Match the fade-out duration in splash-screen.css
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
      <HeroSection splashComplete={splashComplete} />
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
