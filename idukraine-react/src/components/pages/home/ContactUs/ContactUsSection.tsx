import '../../../../assets/styles/contact-us.css';
import PhoneIcon from '../../../../assets/svgs/call.svg';
import MailIcon from '../../../../assets/svgs/mail.svg';
import FacebookIcon from '../../../../assets/svgs/facebook.svg';

function ContactUsSection() {
  return (
    <section className="contact-us-section">
      <h2 className="contact-us-title">/Як з нами зв’язатися</h2>
      <div className="contact-us-content">
        <div className="contact-us-left">
          <h3 className="contact-us-main-heading">
            Потрібна допомога? Зв'яжіться з нами
          </h3>
          <p className="contact-us-subheading">
            Звертайтеся до нас за будь-якими питаннями чи допомогою. Ми тут, щоб
            допомогти!
          </p>
        </div>
        <div className="contact-us-right">
          <div className="contact-card">
            <div className="contact-card-inner">
              <div className="contact-item">
                <p className="contact-title">Phone</p>
                <div className="contact-content">
                  <PhoneIcon className="contact-icon" />
                  <p className="contact-text">+380 67 843-02-44</p>
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
        </div>
      </div>
    </section>
  );
}

export default ContactUsSection;
