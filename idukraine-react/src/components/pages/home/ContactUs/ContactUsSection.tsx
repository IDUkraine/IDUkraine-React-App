import { motion } from 'framer-motion';
import '../../../../assets/styles/contact-us.css';
import PhoneIcon from '../../../../assets/svgs/icons/call.svg';
import MailIcon from '../../../../assets/svgs/icons/mail.svg';
import FacebookIcon from '../../../../assets/svgs/icons/facebook.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { useLanguage } from '../../../../context/LanguageContext';

function ContactUsSection() {
  const [ref, hasAnimated] = useSectionAnimation();
  const { t } = useLanguage();

  return (
    <section className="contact-us-section" id="contacts" ref={ref}>
      <h2 className="contact-us-title">{t('contact.title')}</h2>
      <div className="contact-us-content">
        <motion.div
          className="contact-us-left"
          initial={{ y: -60, opacity: 0 }}
          animate={hasAnimated ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h3 className="contact-us-main-heading">{t('contact.heading')}</h3>
          <p className="contact-us-subheading">{t('contact.subheading')}</p>
        </motion.div>
        <motion.div
          className="contact-us-right"
          initial={{ x: 60, opacity: 0 }}
          animate={hasAnimated ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          <div className="contact-card">
            <div className="contact-card-inner">
              <div className="contact-item">
                <p className="contact-title">{t('contact.phone')}</p>
                <div className="contact-content">
                  <PhoneIcon className="contact-icon" />
                  <a href="tel:+380730910824" className="contact-text">
                    +380 73 091-08-24
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <p className="contact-title">{t('contact.email')}</p>
                <div className="contact-content">
                  <MailIcon className="contact-icon" />
                  <a
                    href="mailto:IDUKRAINE91@GMAIL.COM"
                    className="contact-text"
                  >
                    IDUKRAINE91@GMAIL.COM
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <p className="contact-title">{t('contact.socials')}</p>
                <div className="contact-content">
                  <FacebookIcon className="contact-icon" />
                  <a
                    href="https://www.facebook.com/share/15xt6pDzqH/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-text"
                  >
                    {t('contact.facebook')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactUsSection;
