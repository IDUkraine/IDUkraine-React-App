import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import '../../assets/styles/not-found.css';

const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">{t('error.404')}</h1>
      <p className="not-found-text">{t('error.404.text')}</p>
      <Link to="/" className="not-found-link">
        {t('error.404.back')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
