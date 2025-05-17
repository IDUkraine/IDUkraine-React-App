import ArrowIcon from '../../../../assets/svgs/icons/arrow-right-alt.svg';
import '../../../../assets/styles/top-news.css';
import { useLanguage } from '../../../../context/LanguageContext';

interface NewsCardProps {
  titleEn: string;
  titleUk: string;
  textEn: string;
  textUk: string;
  date: string;
  categoryEn: string;
  categoryUk: string;
  image?: string;
  onClick: () => void;
}

function TopNewsCard({
  titleEn,
  titleUk,
  textEn,
  textUk,
  date,
  categoryEn,
  categoryUk,
  image,
  onClick,
}: NewsCardProps) {
  const { language } = useLanguage();

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const title = language === 'en' ? titleEn : titleUk;
  const text = language === 'en' ? textEn : textUk;
  const category = language === 'en' ? categoryEn : categoryUk;
  const plainText = stripHtml(text);

  return (
    <div className="top-news-card" onClick={onClick}>
      <div
        className="top-news-image"
        style={{ backgroundImage: image ? `url(${image})` : undefined }}
      ></div>
      <div className="top-news-content">
        <div className="top-news-header">
          <span className="top-news-icon">important</span>
          <h3 className="top-news-title">{title}</h3>
          <p className="top-news-category">{category}</p>
        </div>
        <p className="top-news-text">{plainText.slice(0, 170)}...</p>
      </div>
      <div className="top-news-footer">
        <span className="top-news-date">{date}</span>
        <ArrowIcon className="top-news-arrow-icon" />
      </div>
    </div>
  );
}

export default TopNewsCard;
