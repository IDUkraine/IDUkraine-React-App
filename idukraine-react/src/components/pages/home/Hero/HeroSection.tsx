import { motion } from 'framer-motion';
import '../../../../assets/styles/hero.css';

const HeroSection = () => {
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
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          Integrity & Development Ukraine
        </motion.h1>
        <motion.button
          className="hero-button"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          onClick={handleButtonClick}
        >
          Ознайомитися
        </motion.button>
      </div>

      <div className="hero-image-container">
        <img src="./hero-image.jpg" alt="Hero Image" className="hero-image" />
        <div className="hero-overlay">
          <p className="overlay-text">Розвивай добро чесно</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
