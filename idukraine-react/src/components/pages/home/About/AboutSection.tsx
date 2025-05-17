import { motion } from 'framer-motion';
import '../../../../assets/styles/about.css';
import FingerPrintAbout from '../../../../assets/svgs/fingerprints/fingerprint-about.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { useLanguage } from '../../../../context/LanguageContext';
import DOMPurify from 'dompurify';

const AboutSection = () => {
  const [ref, hasAnimated] = useSectionAnimation();
  const { t } = useLanguage();

  return (
    <section className="about-section" id="about" ref={ref}>
      <div className="about-container">
        <h2 className="about-subtitle">{t('about.subtitle')}</h2>
        <div className="about-content">
          <motion.div
            className="about-image-container"
            initial={{ opacity: 0, y: -60 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src="./about-image.jpg"
              alt={t('about.subtitle')}
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
            <h1
              className="about-title"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(t('about.title')),
              }}
            />
            <p className="about-text">{t('about.text')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
