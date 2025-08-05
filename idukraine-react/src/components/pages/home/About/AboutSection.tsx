import { motion, AnimatePresence } from 'framer-motion';
import '../../../../assets/styles/about.css';
import FingerPrintAbout from '../../../../assets/svgs/fingerprints/fingerprint-about.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { useLanguage } from '../../../../context/LanguageContext';
import DOMPurify from 'dompurify';
import { useEffect, useState, useCallback, useRef } from 'react';

// Import images directly or use a dynamic import if they are in a specific folder
import aboutImage1 from '../../../../../public/about-image-1.jpeg';
import aboutImage2 from '../../../../../public/about-image-2.jpg';

const AboutSection = () => {
  const [ref, hasAnimated] = useSectionAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [imagesLoaded, setImagesLoaded] = useState(false); // New state to track image loading

  const aboutImages = [
    {
      src: aboutImage1, // Use imported images
      alt: t('about.subtitle'),
    },
    {
      src: aboutImage2,
      alt: t('about.subtitle'),
    },
  ];

  // Function to preload images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = aboutImages.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    aboutImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
      img.onload = handleImageLoad;
      img.onerror = () => {
        console.error(`Failed to load image: ${image.src}`);
        // Potentially still set imagesLoaded to true if you want to proceed even with some failures
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
    });
  }, []); // Run once on mount

  const startImageRotation = useCallback(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }

    timeoutRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
    }, 6000);
  }, [aboutImages.length]);

  const handleIndicatorClick = useCallback(
    (index: number) => {
      setCurrentImageIndex(index);
      startImageRotation();
    },
    [startImageRotation]
  );

  useEffect(() => {
    if (imagesLoaded) {
      // Only start rotation after all images are loaded
      startImageRotation();
    }

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [startImageRotation, imagesLoaded]); // Add imagesLoaded to dependency array

  return (
    <section className="about-section" id="about" ref={ref}>
      <div className="about-container">
        <h2 className="about-subtitle">{t('about.subtitle')}</h2>
        <div className="about-content">
          <motion.div
            className="about-image-container"
            initial={{ opacity: 0, y: 60 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Render only when images are loaded */}
            {imagesLoaded && (
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex} // Keep the key for Framer Motion transitions
                  src={aboutImages[currentImageIndex].src}
                  alt={aboutImages[currentImageIndex].alt}
                  className="about-image"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
            )}
            {!imagesLoaded && <div className="loading-spinner"></div>}
            <FingerPrintAbout className="about-fingerprint" />
            <div className="image-indicators">
              {aboutImages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`image-indicator ${
                    index === currentImageIndex ? 'active' : ''
                  }`}
                  onClick={() => handleIndicatorClick(index)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              ))}
            </div>
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
