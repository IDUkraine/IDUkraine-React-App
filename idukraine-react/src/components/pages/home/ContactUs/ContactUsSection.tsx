import { motion } from 'framer-motion';
import '../../../../assets/styles/contact-us.css';
import PhoneIcon from '../../../../assets/svgs/icons/call.svg';
import MailIcon from '../../../../assets/svgs/icons/mail.svg';
import FacebookIcon from '../../../../assets/svgs/icons/facebook.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';

function ContactUsSection() {
  const [ref, hasAnimated] = useSectionAnimation();

  return (
    <section className="contact-us-section" ref={ref}>
      <h2 className="contact-us-title">/Як з нами зв’язатися</h2>
      <div className="contact-us-content">
        <motion.div
          className="contact-us-left"
          initial={{ y: -60, opacity: 0 }}
          animate={hasAnimated ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h3 className="contact-us-main-heading">Зв'яжіться з нами</h3>
          <p className="contact-us-subheading">
            Звертайтеся до нас за будь-якими питаннями чи допомогою. Ми тут, щоб
            допомогти!
          </p>
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
                <p className="contact-title">Phone</p>
                <div className="contact-content">
                  <PhoneIcon className="contact-icon" />
                  <p className="contact-text">+380 73 091-08-24</p>
                </div>
              </div>
              <div className="contact-item">
                <p className="contact-title">Email</p>
                <div className="contact-content">
                  <MailIcon className="contact-icon" />
                  <p className="contact-text">example@gmail.com</p>
                </div>
              </div>
              <div className="contact-item">
                <p className="contact-title">Socials</p>
                <div className="contact-content">
                  <FacebookIcon className="contact-icon" />
                  <p className="contact-text">ID Ukraine</p>
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
