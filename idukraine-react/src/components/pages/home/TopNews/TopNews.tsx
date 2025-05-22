import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../../../assets/styles/top-news.css';
import TopNewsCard from './TopNewsCard';
import NewsModal from '../common/NewsModal';
import { NewsItem } from '../../../../types/news';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { newsService } from '../../../../services/newsService';
import { useLanguage } from '../../../../context/LanguageContext';

function TopNewsSection() {
  const [ref, hasAnimated] = useSectionAnimation();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { t } = useLanguage();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const loadTopNews = async () => {
      try {
        const data = await newsService.getTopNews();
        setNewsItems(data);
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          setIsContentReady(true);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };

    loadTopNews();
  }, []);

  const openModal = (news: NewsItem) => {
    setSelectedNews(news);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews]);

  if (!isHydrated) {
    return null; // Prevent flash of unstyled content
  }

  if (isLoading && !isContentReady) {
    return (
      <section className="top-news-section" id="news" ref={ref}>
        <div className="loading">{t('news.loading')}</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="top-news-section" id="news" ref={ref}>
        <div className="error">{t('news.error')}</div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return (
      <section className="top-news-section" id="news" ref={ref}>
        <div className="no-news">{t('news.empty')}</div>
      </section>
    );
  }

  return (
    <section className="top-news-section" id="news" ref={ref}>
      <h2 className="top-news-section-title">{t('news.topNews')}</h2>
      <div className="top-news-container">
        {newsItems.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              hasAnimated && isContentReady ? { opacity: 1, scale: 1 } : {}
            }
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: index * 0.2,
            }}
            style={{ width: '100%', maxWidth: '400px' }}
          >
            <TopNewsCard
              key={news.id}
              titleEn={news.titleEn}
              titleUk={news.titleUk}
              textEn={news.textEn}
              textUk={news.textUk}
              date={new Date(news.date).toLocaleDateString(t('locale'), {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              categoryEn={news.categoryEn}
              categoryUk={news.categoryUk}
              image={news.image || './news-image.jpg'}
              onClick={() => openModal(news)}
            />
          </motion.div>
        ))}
      </div>
      {selectedNews && <NewsModal news={selectedNews} onClose={closeModal} />}
    </section>
  );
}

export default TopNewsSection;
