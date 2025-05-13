import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useState, useEffect, useRef } from 'react';
import '../../../../assets/styles/general-news.css';
import { useTruncateText } from '../../../../hooks/useTruncateText';
import RightArrowIcon from '../../../../assets/svgs/icons/arrow-circle-right.svg';
import LeftArrowIcon from '../../../../assets/svgs/icons/arrow-circle-left.svg';
import NewsModal from '../common/NewsModal';
import { NewsItem } from '../../../../types/types';

const newsItems: NewsItem[] = [
  {
    title: 'Lorem ipsum dolor consectetur adipiscing elit amet1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 24th, 2025',
    category: 'Антикорупційна діяльність',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit amet2',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 25th, 2025',
    category: 'Антикорупційна діяльність',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit amet3',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 26th, 2025',
    category: 'Антикорупційна діяльність',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    title: 'Lorem ipsum dolor sit amet4',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa who officiates mollit anim id est laborum.',
    date: 'March 27th, 2025',
    category: 'Антикорупційна діяльність',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    title: 'Lorem ipsum dolor sit amet5',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 28th, 2025',
    category: 'Антикорупційна діяльність',
    image: 'https://via.placeholder.com/600x400',
  },
];

const GeneralNewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const newsSectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const { truncateText } = useTruncateText();

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
      origin: 0, // Змінено з 'auto' на 0 для вирівнювання ліворуч
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
      // Force slider update on resize
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
      duration: 350,
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

  // Auto-scrolling logic
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovered, currentSlide]);

  // Handle mouse enter/leave to pause/resume auto-scrolling
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

  return (
    <section className="general-news-section" id="news" ref={newsSectionRef}>
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
            // Виправлена логіка для isNext у неперемикаючому слайдері
            const isNext = index === currentSlide + 1;

            return (
              <div
                key={index}
                className={`keen-slider__slide title-slide ${
                  isActive ? 'active' : isNext ? 'next' : 'inactive'
                }`}
              >
                <p className="keen-slider-title">
                  {isActive ? news.title : news.title.slice(0, 25) + '...'}
                </p>
              </div>
            );
          })}
        </div>

        <hr className="general-news-divider" />

        <div ref={sliderRef} className="keen-slider general-news-slider">
          {newsItems.map((news, index) => (
            <div key={index} className="keen-slider__slide general-news-slide">
              <div className="general-news-card">
                <div className="general-news-content">
                  <div className="general-news-image-placeholder" />
                  <div className="general-news-text">
                    <p>{truncateText(news.text, 70)}</p>
                    <p
                      className="general-news-read-more"
                      onClick={() => openModal(news)}
                    >
                      Читати далі
                    </p>
                  </div>

                  <span className="general-news-date">{news.date}</span>
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
