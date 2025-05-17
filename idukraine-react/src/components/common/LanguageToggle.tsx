import { useLanguage } from '../../context/LanguageContext';
import '../../assets/styles/language-toggle.css';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-toggle">
      <button
        className={`language-btn ${language === 'ua' ? 'active' : ''}`}
        onClick={() => setLanguage('ua')}
      >
        UA
      </button>
      <span className="language-separator">|</span>
      <button
        className={`language-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
