import { motion, AnimatePresence } from 'framer-motion';
import '../../../../assets/styles/hero.css';
import { useEffect, useState } from 'react';
import FingerprintMilestone from '../../../../assets/svgs/fingerprints/fingerprint-milestone.svg';

interface HeroSectionProps {
  splashComplete: boolean;
}

const HeroSection = ({ splashComplete }: HeroSectionProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const [currentIndex, setCurrentIndex] = useState(0);

  const milestones = [
    {
      year_amount: 8,
      year_text: 'Років',
      phrase: 'Працюємо над розвитком доброчесності в Україні',
    },
    {
      year_amount: 22,
      year_text: 'Роки',
      phrase: 'Досвіду роботи в сфері публічних фінансів',
    },
    {
      year_amount: 3,
      year_text: 'Роки',
      phrase: 'Досвіду роботи в сфері відновлення',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % milestones.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [milestones.length]);

  const handleButtonClick = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-header">
        <motion.h1
          className="hero-title"
          initial={{ x: -100, opacity: 0 }}
          animate={
            splashComplete ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }
          }
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          Integrity & Development Ukraine
        </motion.h1>
        {!isMobile && (
          <motion.button
            className="hero-button"
            initial={{ x: 100, opacity: 0 }}
            animate={
              splashComplete ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }
            }
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            onClick={handleButtonClick}
          >
            Ознайомитися
          </motion.button>
        )}
      </div>

      <div className="hero-image-container">
        <img src="./hero-image.jpg" alt="Hero Image" className="hero-image" />
        <div className="hero-overlay">
          {!isMobile && <p className="overlay-text">Розвивай добро чесно</p>}
        </div>
      </div>
      {isMobile && (
        <div className="moto-container">
          <p className="moto-text">Розвивай добро чесно</p>
          {isMobile && (
            <motion.button
              className="hero-button"
              initial={{ x: 100, opacity: 0 }}
              animate={
                splashComplete ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }
              }
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              onClick={handleButtonClick}
            >
              Ознайомитися
            </motion.button>
          )}
        </div>
      )}
      <div className="milestone-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="milestone-text"
            initial={{ opacity: 0, y: 20 }}
            animate={
              splashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="milestone-year">
              <p className="milestone-year-amount">
                {milestones[currentIndex].year_amount}
              </p>{' '}
              <p className="milestone-year-text">
                {milestones[currentIndex].year_text}
              </p>
            </div>
            <p className="milestone-phrase">
              {milestones[currentIndex].phrase}
            </p>
          </motion.div>
        </AnimatePresence>
        <FingerprintMilestone className="milestone-icon" />
      </div>
    </section>
  );
};

export default HeroSection;
