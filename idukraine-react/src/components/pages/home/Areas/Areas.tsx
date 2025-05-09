import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../../../assets/styles/areas.css';
import AreaCard from './AreaCard';
import HouseIcon from '../../../../assets/svgs/house.svg';
import RepairIcon from '../../../../assets/svgs/repair.svg';
import CorruptionIcon from '../../../../assets/svgs/corruption.svg';
import PublicPropertyIcon from '../../../../assets/svgs/public-property.svg';
import FingerPrintLeft from '../../../../assets/svgs/fingerprints/fingerprint-areas-left.svg';
import FingerPrintRight from '../../../../assets/svgs/fingerprints/fingerprint-areas-right.svg';
import CloseIcon from '../../../../assets/svgs/close.svg';
import FingerPrintOnSelect from '../../../../assets/svgs/fingerprints/fingerprint-areas-have-selected.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { useTruncateText } from '../../../../hooks/useTruncateText';

const AreasSection = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closingCard, setClosingCard] = useState<string | null>(null);
  const [ref, hasAnimated] = useSectionAnimation();
  const { truncateText } = useTruncateText();

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

  const animationDelays = [0, 0.2, 0.6, 0.4];
  const spanValues = [5, 7, 6, 6];

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
        <div className="details-container">
          <div
            className={`details-content ${isClosing ? 'closing' : ''}`}
            onAnimationEnd={handleAnimationEnd}
          >
            <CloseIcon className="details-close" onClick={handleCloseDetails} />
            {cards.map((card) =>
              selectedCard === card.title || closingCard === card.title ? (
                <div key={card.title} className="details-body">
                  <card.icon className={`details-icon ${card.iconClass}`} />
                  <h3 className="details-title">{card.title}</h3>
                  <p className="details-text">{card.text}</p>
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
