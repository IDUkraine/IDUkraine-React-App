import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import TitledLogo from '../../assets/svgs/logos/header-logo.svg';
import NavigationOptions from './NavigationOptions';
import IconedNavigationOptions from './IconedNavigationOptions';
import '../../assets/styles/header.css';
import CloseIcon from '../../assets/svgs/icons/close.svg';
import MenuLogo from '../../assets/svgs/logos/menu-logo.svg';
import MenuIcon from '../../assets/svgs/icons/menu-icon.svg';
import LanguageToggle from '../common/LanguageToggle';

interface HeaderProps {
  splashComplete: boolean;
}

const Header = ({ splashComplete }: HeaderProps) => {
  const [visible, setVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (window.scrollY > 0 && !isMenuOpen && !isHovered) {
        timerRef.current = setTimeout(() => {
          setVisible(false);
        }, 8000);
      }
    };

    window.addEventListener('scroll', handleScroll);

    if (window.scrollY > 0 && !isMenuOpen && !isHovered) {
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 8000);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isMenuOpen, isHovered]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      className="header-container"
      initial={{ y: -100, opacity: 0 }}
      animate={
        visible && splashComplete
          ? { y: 0, opacity: 1 }
          : { y: -100, opacity: 0 }
      }
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TitledLogo
        className="header-logo"
        onClick={scrollToTop}
        style={{ cursor: 'pointer' }}
      />
      <div className="header-right desktop-only">
        <div className="header-nav-options desktop-only">
          <NavigationOptions />
        </div>
        <LanguageToggle />
      </div>
      <div className="mobile-controls mobile-only">
        <LanguageToggle />
        <button className="hamburger-menu" onClick={toggleMenu}>
          <MenuIcon className="menu-icon" />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleOverlayClick}
            />
            <motion.div
              className="mobile-menu"
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="menu-top-content" onClick={toggleMenu}>
                <MenuLogo className="menu-logo" />
                <CloseIcon className="menu-close-icon" />
              </div>
              <IconedNavigationOptions onNavClick={toggleMenu} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Header;
