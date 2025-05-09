import { motion } from 'framer-motion';
import '../../../../assets/styles/about.css';
import FingerPrintAbout from '../../../../assets/svgs/fingerprints/fingerprint-about.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';

const AboutSection = () => {
  const [ref, hasAnimated] = useSectionAnimation();

  return (
    <section className="about-section" id="about" ref={ref}>
      <div className="about-container">
        <h2 className="about-subtitle">/Про нас</h2>
        <div className="about-content">
          <motion.div
            className="about-image-container"
            initial={{ opacity: 0, y: -60 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src="./hero-image.jpg"
              alt="About Image"
              className="about-image"
            />
            <FingerPrintAbout className="about-fingerprint" />
          </motion.div>

          <motion.div
            className="about-right-content"
            initial={{ opacity: 0, y: -60 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <h1 className="about-title">
              Integrity & Development Ukraine will focus on{' '}
              <span className="about-title-orange">
                activities that involve the creation of a comprehensive strategy{' '}
              </span>
              for certain areas of state development, namely in terms of
              anti-corruption, public finance, public property management and
              recovery.
            </h1>
            <p className="about-text">
              The NGO's activities will be aimed at creating analytical,
              monitoring, and legislative products that would comprehensively
              address legal issues.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
