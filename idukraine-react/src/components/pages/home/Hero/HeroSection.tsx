import '../../../../assets/styles/hero.css';
import StatsBlock from './StatsBlock';
import Certificate1 from '../../../../assets/svgs/certificates/certificate-1.svg';
import Certificate2 from '../../../../assets/svgs/certificates/certificate-2.svg';
import Certificate3 from '../../../../assets/svgs/certificates/certificate-3.svg';
import Certificate4 from '../../../../assets/svgs/certificates/certificate-4.svg';
import FingerPrintStats1 from '../../../../assets/svgs/fingerprints/fingerprint-stats-1.svg';
import FingerPrintStats2 from '../../../../assets/svgs/fingerprints/fingerprint-stats-2.svg';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-header">
        <h1 className="hero-title">Integrity & Development Ukraine</h1>
        <button className="hero-button">Ознайомитися</button>
      </div>
      <div className="hero-image-container">
        <img src="./hero-image.jpg" alt="Hero Image" className="hero-image" />
        <div className="hero-overlay">
          <h2 className="overlay-title">Громадська організація</h2>
          <p className="overlay-text">
            Прозорість. Відповідальність. Відновлення - будуємо цілісну Україну
            разом!
          </p>
        </div>
      </div>
      <div className="hero-stats">
        <StatsBlock title="50" text="Успішних кейсів">
          <FingerPrintStats1 className="stats-icon stats-icon-left" />
        </StatsBlock>
        <StatsBlock title="100+" text="Задоволених клієнтів">
          <FingerPrintStats2 className="stats-icon stats-icon-middle" />
        </StatsBlock>
        <StatsBlock isDark={true}>
          <div className="certificates-container">
            <Certificate1 />
            <Certificate2 />
            <Certificate3 />
            <Certificate4 />
          </div>
        </StatsBlock>
      </div>
    </section>
  );
};

export default HeroSection;
