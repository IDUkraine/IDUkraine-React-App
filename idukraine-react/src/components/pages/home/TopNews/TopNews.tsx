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
  const [ref, hasAnimated] = useSectionAnimation(); // hasAnimated tells us when the section is visible
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // New state to indicate the content is loaded AND ready for animation
  const [isContentReady, setIsContentReady] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const loadTopNews = async () => {
      try {
        const data = await newsService.getTopNews();
        setNewsItems(data);
        // Data is loaded, but give React/DOM a moment to render the cards
        // before marking content as ready for animation
        // A small timeout can help ensure elements are in the DOM
        setTimeout(() => {
          setIsContentReady(true);
        }, 50); // You might need to adjust this delay
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
        setIsLoading(false); // Ensure loading is false on error
      } finally {
        // Only set isLoading to false after content is ready for animation,
        // or manage loading state separately if you need a loading indicator shown longer
        // For animation timing, setting content ready state is key
        if (!error) {
          // Only set loading false if no error
          setIsLoading(false);
        }
      }
    };

    loadTopNews();
  }, []); // Effect runs once on mount for data fetching

  const openModal = (news: NewsItem) => {
    setSelectedNews(news);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  // Prevent body scrolling when modal is open
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

  if (isLoading && !isContentReady) {
    // You might want to render the section wrapper even when loading
    // so the ref is attached early, but ensure it has minimal height
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

  // Render the section and cards only after data is loaded (or on error)
  // The animation will be controlled by hasAnimated AND isContentReady
  return (
    <section className="top-news-section" id="news" ref={ref}>
      <h2 className="top-news-section-title">{t('news.topNews')}</h2>
      <div className="top-news-container">
        {newsItems.map((news, index) => (
          <motion.div
            key={news.id} // Using news.id is correct for keys
            initial={{ opacity: 0, scale: 0.8 }}
            // Animate only if the section is visible AND the content is marked as ready
            animate={
              hasAnimated && isContentReady ? { opacity: 1, scale: 1 } : {}
            }
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.2 }}
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
