import { motion } from 'framer-motion';
import '../../assets/styles/footer.css';
import FooterLogo from '../../assets/svgs/logos/footer-logo.svg';
import PhoneIcon from '../../assets/svgs/icons/call.svg';
import MailIcon from '../../assets/svgs/icons/mail.svg';
import FacebookIcon from '../../assets/svgs/icons/facebook.svg';
import FooterFingerprint from '../../assets/svgs/fingerprints/fingerprint-footer.svg';
import NavigationOptions from './NavigationOptions';
import { useSectionAnimation } from '../../hooks/useSectionAnimation';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [ref, hasAnimated] = useSectionAnimation();
  const [initialY, setInitialY] = useState(window.innerWidth < 480 ? 50 : 160);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setInitialY(50);
      } else {
        setInitialY(160);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="footer-container">
      <motion.div
        initial={{ y: initialY, opacity: 0 }}
        animate={hasAnimated ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        ref={ref}
        className="footer-animation-wrapper"
      >
        <FooterLogo className="footer-logo" />
        <hr className="footer-line" />
        <div className="footer-content">
          <div className="footer-nav-options">
            <NavigationOptions />
          </div>
          <div className="footer-contacts">
            <p className="footer-contacts-title">Наші контакти</p>
            <div className="footer-contacts-container">
              <div className="footer-contacts-item">
                <PhoneIcon className="footer-phone-icon" />
                <p>+380 73 091-08-24</p>
              </div>
              <div className="footer-contacts-item">
                <MailIcon className="footer-mail-icon" />
                <p>example@gmail.com</p>
              </div>
              <div className="footer-contacts-item">
                <FacebookIcon className="footer-facebook-icon" />
                <p>ID Ukraine</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="footer-fingerprint-container">
        <FooterFingerprint className="footer-fingerprint-icon" />
      </div>
    </div>
  );
};

export default Footer;
