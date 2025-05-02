import FooterLogo from '../../assets/svgs/footer-logo.svg';
import PhoneIcon from '../../assets/svgs/call.svg';
import MailIcon from '../../assets/svgs/mail.svg';
import FacebookIcon from '../../assets/svgs/facebook.svg';
import FooterFingerprint from '../../assets/svgs/fingerprints/fingerprint-footer.svg';
import NavigationOptions from './NavigationOptions';
const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <FooterLogo className="footer-logo" />
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
        <div className="footer-fingerprint-container">
          <FooterFingerprint className="footer-fingerprint-icon" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
