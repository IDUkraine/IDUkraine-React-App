import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from '../../../../assets/svgs/icons/close.svg';
import ArrowTop from '../../../../assets/svgs/icons/arrow-downward.svg';
import { NewsItem } from '../../../../types/news';
import '../../../../assets/styles/modal.css';
import DOMPurify from 'dompurify';

interface NewsModalProps {
  news: NewsItem;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ news, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 500);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
      setIsVisible(false);
    };
  }, []);

  useEffect(() => {
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });

    return () => {
      DOMPurify.removeHook('afterSanitizeAttributes');
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`news-modal ${
        isVisible ? 'news-modal--visible' : 'news-modal--hidden'
      }`}
    >
      <div className="news-modal-content" ref={contentRef}>
        <div className="news-modal-close" onClick={handleClose}>
          <CloseIcon className="news-modal-close-icon" />
        </div>
        <div className="news-modal-header">
          <span className="news-modal-date">{formatDate(news.date)}</span>
          <h2 className="news-modal-title">{news.title}</h2>
          <span className="news-modal-category">{news.category}</span>
        </div>
        {news.image && (
          <div className="news-modal-image-container">
            <img
              src={news.image}
              alt={news.title}
              className="news-modal-image"
            />
          </div>
        )}
        <div className="news-modal-body">
          <div className="news-modal-main">
            <div
              className="news-modal-text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(news.text),
              }}
            />
          </div>
        </div>
        <ArrowTop
          className={`news-modal-scroll-top ${
            showScrollTop ? 'news-modal-scroll-top--visible' : ''
          }`}
          onClick={scrollToTop}
        />
      </div>
    </div>
  );
};

export default NewsModal;
