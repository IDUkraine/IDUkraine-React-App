import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useState, useEffect, useRef } from 'react';
import '../../../../assets/styles/general-news.css';
import { useTruncateText } from '../../../../hooks/useTruncateText';
import RightArrowIcon from '../../../../assets/svgs/icons/arrow-circle-right.svg';
import LeftArrowIcon from '../../../../assets/svgs/icons/arrow-circle-left.svg';
import NewsModal from '../common/NewsModal';
import { NewsItem } from '../../../../types/news';
import { newsService } from '../../../../services/newsService';

const GeneralNewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const newsSectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const { truncateText } = useTruncateText();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await newsService.getAllNews();
        setNewsItems(data.filter((item) => item.isPublished));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    animationEnded(slider) {
      if (titlesInstanceRef.current) {
        const newIndex = slider.track.details.rel;
        titlesInstanceRef.current.moveToIdx(newIndex, false, {
          duration: 550,
          easing: (t: number) => t,
        });
      }
    },
    slides: {
      perView: 1,
      spacing: 20,
    },
    updated(slider) {
      slider.container.style.height = 'auto';
    },
  });

  const [titlesSliderRef, titlesInstanceRef] = useKeenSlider({
    initial: 0,
    loop: false,
    mode: 'snap',
    slides: {
      perView: isMobile ? 1 : 2,
      spacing: 20,
      origin: 0,
    },
    drag: false,
    rubberband: false,
    renderMode: 'performance',
    updated(slider) {
      const slides = slider.slides;
      let maxHeight = 0;
      slides.forEach((slide) => {
        const height = slide.offsetHeight;
        if (height > maxHeight) maxHeight = height;
      });
      slider.container.style.minHeight = `${maxHeight}px`;
    },
  });

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 769;
      setIsMobile(newIsMobile);
      instanceRef.current?.update();
      titlesInstanceRef.current?.update();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [instanceRef, titlesInstanceRef]);

  const animation = { duration: 1000 };

  const handlePrev = () => {
    if (
      !instanceRef.current ||
      !titlesInstanceRef.current ||
      currentSlide === 0
    ) {
      return;
    }

    const newIndex = currentSlide - 1;
    instanceRef.current.moveToIdx(newIndex, false, animation);
    titlesInstanceRef.current.moveToIdx(newIndex, false, {
      duration: 500,
      easing: (t: number) => t,
    });
    setCurrentSlide(newIndex);
  };

  const handleNext = () => {
    if (!instanceRef.current || !titlesInstanceRef.current) {
      return;
    }

    const newIndex =
      currentSlide === newsItems.length - 1 ? 0 : currentSlide + 1;
    instanceRef.current.moveToIdx(newIndex, false, animation);
    titlesInstanceRef.current.moveToIdx(newIndex, false, {
      duration: 450,
    });
    setCurrentSlide(newIndex);
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, 60000);

    return () => clearInterval(interval);
  }, [isHovered, currentSlide]);

  useEffect(() => {
    const section = newsSectionRef.current;
    if (!section) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    section.addEventListener('mouseenter', handleMouseEnter);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mouseenter', handleMouseEnter);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
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

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section
      className="general-news-section"
      id="general-news"
      ref={newsSectionRef}
    >
      <div className="general-news-container">
        <div className="general-news-header">
          <h2 className="general-news-title">/Всі новини</h2>
          <div className="general-news-arrows">
            <div
              className={`slick-arrow ${currentSlide === 0 ? 'disabled' : ''}`}
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <LeftArrowIcon className="slick-custom-icon" />
            </div>
            <div
              className="slick-arrow"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <RightArrowIcon className="slick-custom-icon" />
            </div>
          </div>
        </div>

        <div className="keen-slider titles-slider" ref={titlesSliderRef}>
          {newsItems.map((news, index) => {
            const isActive = index === currentSlide;
            const isNext = index === currentSlide + 1;

            return (
              <div
                key={news.id}
                className={`keen-slider__slide title-slide ${
                  isActive ? 'active' : isNext ? 'next' : 'inactive'
                }`}
              >
                <p className="keen-slider-title">
                  {isActive ? news.title : truncateText(news.title, 4)}
                </p>
              </div>
            );
          })}
        </div>

        <hr className="general-news-divider" />

        <div ref={sliderRef} className="keen-slider general-news-slider">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="keen-slider__slide general-news-slide"
            >
              <div className="general-news-card">
                <div className="general-news-content">
                  {news.image && (
                    <div
                      className="general-news-image-placeholder"
                      style={{ backgroundImage: `url(${news.image})` }}
                    />
                  )}
                  <div className="general-news-text">
                    <p>{truncateText(stripHtml(news.text), 70)}</p>
                    <p
                      className="general-news-read-more"
                      onClick={() => openModal(news)}
                    >
                      Читати далі
                    </p>
                  </div>

                  <span className="general-news-date">
                    {new Date(news.date).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNews && <NewsModal news={selectedNews} onClose={closeModal} />}
    </section>
  );
};

export default GeneralNewsSection;
