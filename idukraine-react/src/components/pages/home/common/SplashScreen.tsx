import { useEffect, useState } from 'react';
import '../../../../assets/styles/splash-screen.css';
import Logo from '../../../../assets/svgs/logos/splash-screen-logo.svg';

interface SplashScreenProps {
  onComplete: () => void;
  onFadeStart: () => void;
}

function SplashScreen({ onComplete, onFadeStart }: SplashScreenProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      onFadeStart();
    }, 300000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 400000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, onFadeStart]);

  return (
    <div className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="splash-screen-content">
        <Logo className="splash-logo" />
        <h1 className="splash-title">Розвивай добро чесно</h1>
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      </div>
      <div
        className="splash-image"
        style={{
          backgroundImage: 'url(./splash-screen-image.png)',
        }}
      ></div>
    </div>
  );
}

export default SplashScreen;
