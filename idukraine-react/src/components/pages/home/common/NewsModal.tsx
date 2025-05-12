import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from '../../../../assets/svgs/icons/close.svg';
import ArrowTop from '../../../../assets/svgs/icons/arrow-downward.svg';
import { NewsItem } from '../../../../types/types';

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

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          <span className="news-modal-date">{news.date}</span>
          <h2 className="news-modal-title">{news.title}</h2>
          <span className="news-modal-category">{news.category}</span>
        </div>
        <div className="news-modal-image" />
        <div className="news-modal-body">
          <div className="news-modal-main">
            <p className="news-modal-text">{news.text}</p>
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
