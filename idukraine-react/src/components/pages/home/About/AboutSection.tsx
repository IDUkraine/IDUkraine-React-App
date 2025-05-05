import { motion } from 'framer-motion';
import '../../../../assets/styles/about.css';
import FingerPrintAbout from '../../../../assets/svgs/fingerprints/fingerprint-about.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';

const AboutSection = () => {
  const [ref, hasAnimated] = useSectionAnimation();

  return (
    <section className="about-section" ref={ref}>
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
              Lorem ipsum dolor sit amet,{' '}
              <span className="about-title-orange">
                consectetur adipiscing elit
              </span>
              , sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </h1>
            <p className="about-text">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
