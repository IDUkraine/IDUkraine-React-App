import { useState, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import '../../../../assets/styles/areas.css';
import '../../../../assets/styles/modal.css';
import AreaCard from './AreaCard';
import HouseIcon from '../../../../assets/svgs/icons/house.svg';
import RepairIcon from '../../../../assets/svgs/icons/repair.svg';
import CorruptionIcon from '../../../../assets/svgs/icons/corruption.svg';
import PublicPropertyIcon from '../../../../assets/svgs/icons/public-property.svg';
import FingerPrintLeft from '../../../../assets/svgs/fingerprints/fingerprint-areas-left.svg';
import FingerPrintRight from '../../../../assets/svgs/fingerprints/fingerprint-areas-right.svg';
import CloseIcon from '../../../../assets/svgs/icons/close.svg';
import FingerPrintOnSelect from '../../../../assets/svgs/fingerprints/fingerprint-areas-have-selected.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { useTruncateText } from '../../../../hooks/useTruncateText';

const AreasSection = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closingCard, setClosingCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const [ref, hasAnimated] = useSectionAnimation();
  const { truncateText } = useTruncateText();

  useLayoutEffect(() => {
    // Calculate scrollbar width
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      `${scrollbarWidth}px`
    );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedCard && isMobile) {
      document.documentElement.classList.add('is-locked');
      document.body.classList.add('is-locked');
    } else {
      document.documentElement.classList.remove('is-locked');
      document.body.classList.remove('is-locked');
    }

    return () => {
      document.documentElement.classList.remove('is-locked');
      document.body.classList.remove('is-locked');
    };
  }, [selectedCard, isMobile]);

  const handleArrowClick = (title: string) => {
    setIsClosing(false);
    setClosingCard(null);
    setSelectedCard(title);
  };

  const handleCloseDetails = () => {
    setIsClosing(true);
    setClosingCard(selectedCard);
    setSelectedCard(null);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setClosingCard(null);
      setIsClosing(false);
    }
  };

  const cards = [
    {
      title: 'Громадська власність',
      text: 'Цей напрямок стосується управління та використання майна, що належить державі або громадам (місцевому самоврядуванню).',
      icon: PublicPropertyIcon,
      iconClass: 'areas-public-property-icon',
      fingerprint: null,
    },
    {
      title: 'Розвиток доброчесності, підтримка антикорупційної інфраструктури',
      text: 'Антикорупційна діяльність в Україні спрямована на запобігання, виявлення та протидію корупції в державному та приватному секторах.',
      icon: CorruptionIcon,
      iconClass: 'areas-corruption-icon',
      fingerprint: <FingerPrintLeft className="fingerprint-areas-left" />,
    },
    {
      title: 'Сфера відновлення',
      text: 'Сфера відновлення в Україні зосереджена на відбудові інфраструктури, житла, економіки та соціальних систем, зруйнованих внаслідок війни.',
      icon: RepairIcon,
      iconClass: 'areas-repair-icon',
      fingerprint: <FingerPrintRight className="fingerprint-areas-right" />,
    },
    {
      title: 'Сфера публічних фінансів',
      text: 'Сфера публічних фінансів охоплює управління державними коштами, включаючи бюджетування, державні закупівлі, оподаткування, управління боргом та фінансову звітність.',
      icon: HouseIcon,
      iconClass: 'areas-house-icon',
      fingerprint: null,
    },
  ];

  const animationDelays = isMobile ? [0, 0.2, 0.4, 0.6] : [0, 0.2, 0.6, 0.4];
  const spanValues = isMobile ? [1, 1, 1, 1] : [5, 7, 6, 6];

  return (
    <section className="areas-section" id="work-areas" ref={ref}>
      <div className="areas-container">
        <h2 className="areas-subtitle">/Напрями роботи</h2>
        <div className="areas-cards">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={hasAnimated ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay: animationDelays[index],
              }}
              style={{ gridColumn: `span ${spanValues[index]}` }}
            >
              <AreaCard
                title={card.title}
                text={truncateText(card.text, 20)}
                icon={card.icon}
                iconClass={card.iconClass}
                isSelected={selectedCard === card.title}
                onArrowClick={() => handleArrowClick(card.title)}
              >
                {selectedCard !== card.title ? (
                  card.fingerprint
                ) : (
                  <FingerPrintOnSelect className="fingerprint-areas-have-selected" />
                )}
              </AreaCard>
            </motion.div>
          ))}
        </div>
      </div>
      {(selectedCard || closingCard) && (
        <div className="modal-container details-container">
          <div
            className={`details-content ${isClosing ? 'closing' : ''}`}
            onAnimationEnd={handleAnimationEnd}
          >
            <CloseIcon className="details-close" onClick={handleCloseDetails} />
            {cards.map((card) =>
              selectedCard === card.title || closingCard === card.title ? (
                <div key={card.title} className="details-body">
                  <card.icon className={`details-icon ${card.iconClass}`} />
                  <div className="details-text-container">
                    <h3 className="details-title">{card.title}</h3>
                    <p className="details-text">{card.text}</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AreasSection;
