import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import TitledLogo from '../../assets/svgs/header-logo.svg';
import PhoneIcon from '../../assets/svgs/call.svg';
import NavigationOptions from './NavigationOptions';

const Header = () => {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Only set the hide timeout if not at the top of the page
      if (window.scrollY > 0) {
        timerRef.current = setTimeout(() => {
          setVisible(false);
        }, 8000); // 8 секунд без скролу
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Set initial timeout only if not at the top
    if (window.scrollY > 0) {
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 8000);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      className="header-container"
      initial={{ y: -100, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <TitledLogo className="header-logo" />
      <div className="header-nav-options">
        <NavigationOptions />
      </div>
      <div className="header-phone-container">
        <PhoneIcon className="header-phone-icon" />
        <p>+380 67 843-02-44</p>
      </div>
    </motion.div>
  );
};

export default Header;
