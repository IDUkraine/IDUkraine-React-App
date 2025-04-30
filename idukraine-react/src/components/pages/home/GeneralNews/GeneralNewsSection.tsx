import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useState } from 'react';
import '../../../../assets/styles/generalnews.css';
import RightArrowIcon from '../../../../assets/svgs/arrow-circle-right.svg';
import LeftArrowIcon from '../../../../assets/svgs/arrow-circle-left.svg';

const newsItems = [
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 24th, 2025',
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 25th, 2025',
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 26th, 2025',
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 27th, 2025',
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 28th, 2025',
  },
];

const GeneralNewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const [titlesSliderRef, titlesInstanceRef] = useKeenSlider({
    initial: 0,
    loop: false,
    mode: 'snap',
    slides: {
      perView: 3,
      spacing: 10,
      origin: 'center',
    },
    drag: false,
    rubberband: false,
    renderMode: 'performance', // Для покращення рендеру
  });

  const animation = { duration: 1000 };

  const handlePrev = () => {
    if (!instanceRef.current || !titlesInstanceRef.current) return;

    const newIndex =
      currentSlide === 0 ? newsItems.length - 1 : currentSlide - 1;

    instanceRef.current.moveToIdx(newIndex, false, animation);
    titlesInstanceRef.current.moveToIdx(newIndex, false, { duration: 250 });
    setCurrentSlide(newIndex);
  };

  const handleNext = () => {
    if (!instanceRef.current || !titlesInstanceRef.current) return;

    const newIndex =
      currentSlide === newsItems.length - 1 ? 0 : currentSlide + 1;

    instanceRef.current.moveToIdx(newIndex, false, animation);
    titlesInstanceRef.current.moveToIdx(newIndex, false, { duration: 250 });
    setCurrentSlide(newIndex);
  };

  return (
    <section className="general-news-section">
      <div className="general-news-container">
        <div className="general-news-header">
          <h2 className="general-news-title">/Новини</h2>
          <div className="general-news-arrows">
            <div className="slick-arrow" onClick={handlePrev}>
              <LeftArrowIcon className="slick-custom-icon" />
            </div>
            <div className="slick-arrow" onClick={handleNext}>
              <RightArrowIcon className="slick-custom-icon" />
            </div>
          </div>
        </div>

        <div className="keen-slider titles-slider" ref={titlesSliderRef}>
          {newsItems.map((news, index) => {
            const isActive = index === currentSlide;
            const isAdjacent =
              index === (currentSlide + 1) % newsItems.length ||
              index ===
                (currentSlide - 1 + newsItems.length) % newsItems.length;

            return (
              <div
                key={index}
                className={`keen-slider__slide title-slide ${
                  isActive ? 'active' : isAdjacent ? 'adjacent' : 'inactive'
                }`}
              >
                <p className="keen-slider-title">{news.title}</p>
              </div>
            );
          })}
        </div>

        <hr className="general-news-divider" />

        <div ref={sliderRef} className="keen-slider content-slider">
          {newsItems.map((news, index) => (
            <div key={index} className="keen-slider__slide general-news-slide">
              <div className="general-news-card">
                <div className="general-news-content">
                  <div className="general-news-image-placeholder" />
                  <p className="general-news-text">{news.text}</p>
                  <span className="general-news-date">{news.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GeneralNewsSection;
