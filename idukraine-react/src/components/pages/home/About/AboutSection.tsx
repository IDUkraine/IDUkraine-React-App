import { motion, AnimatePresence } from 'framer-motion';
import '../../../../assets/styles/about.css';
import FingerPrintAbout from '../../../../assets/svgs/fingerprints/fingerprint-about.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { useLanguage } from '../../../../context/LanguageContext';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

const AboutSection = () => {
  const [ref, hasAnimated] = useSectionAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  const aboutImages = [
    {
      src: './about-image-1.jpg',
      alt: t('about.subtitle'),
    },
    {
      src: './about-image-2.jpeg',
      alt: t('about.subtitle'),
    },
    {
      src: './about-image-3.jpg',
      alt: t('about.subtitle'),
    },
    {
      src: './about-image-4.jpeg',
      alt: t('about.subtitle'),
    },
    {
      src: './about-image-5.jpg',
      alt: t('about.subtitle'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [aboutImages.length]);

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
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={aboutImages[currentImageIndex].src}
                alt={aboutImages[currentImageIndex].alt}
                className="about-image"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </AnimatePresence>
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
