import '../../../../assets/styles/about.css';
import FingerPrintAbout from '../../../../assets/svgs/fingerprints/fingerprint-about.svg';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-subtitle">/Про нас</h2>
        <div className="about-content">
          <div className="about-image-container">
            <img
              src="./hero-image.jpg"
              alt="About Image"
              className="about-image"
            />
            <FingerPrintAbout className="about-fingerprint" />
          </div>
          <div className="about-right-content">
            <h1 className="about-title">
              Lorem ipsum dolor sit amet,{' '}
              <span className="about-title-orange">
                consectetur adipiscing elit
              </span>
              , sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </h1>
            <p className="about-text">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
