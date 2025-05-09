import { motion } from 'framer-motion';
import '../../assets/styles/footer.css';
import FooterLogo from '../../assets/svgs/logos/footer-logo.svg';
import PhoneIcon from '../../assets/svgs/icons/call.svg';
import MailIcon from '../../assets/svgs/icons/mail.svg';
import FacebookIcon from '../../assets/svgs/icons/facebook.svg';
import FooterFingerprint from '../../assets/svgs/fingerprints/fingerprint-footer.svg';
import NavigationOptions from './NavigationOptions';
import { useSectionAnimation } from '../../hooks/useSectionAnimation';

const Footer = () => {
  const [ref, hasAnimated] = useSectionAnimation();

  return (
    <motion.div
      initial={{ y: 160, opacity: 0 }}
      animate={hasAnimated ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      className="footer-container"
      ref={ref}
    >
      <FooterLogo className="footer-logo" />
      <div className="footer-content">
        <div className="footer-nav-options">
          <NavigationOptions />
        </div>
        <div className="footer-contacts">
          <p className="footer-contacts-title">Наші контакти</p>
          <div className="footer-contacts-container">
            <div className="footer-contacts-item">
              <PhoneIcon className="footer-phone-icon" />
              <p>+380 67 843-02-44</p>
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
      <div className="footer-fingerprint-container">
        <FooterFingerprint className="footer-fingerprint-icon" />
      </div>
    </motion.div>
  );
};

export default Footer;
