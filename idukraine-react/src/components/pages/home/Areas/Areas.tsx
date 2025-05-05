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

const AreasSection = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closingCard, setClosingCard] = useState<string | null>(null); // Track closing card
  const [ref, hasAnimated] = useSectionAnimation();

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

  const truncateText = (text: string, maxWords: number = 20) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const cards = [
    {
      title: 'Антикорупційна діяльність',
      text: 'Антикорупційна діяльність в Україні спрямована на запобігання, виявлення та протидію корупції в державному та приватному секторах. Це включає моніторинг діяльності органів влади, просування прозорості, підтримку законодавчих реформ, громадську освіту та залучення громадян до антикорупційних ініціатив. Корупція в Україні історично була системною проблемою, що гальмує економічний розвиток і знижує довіру до державних інститутів.',
      icon: CorruptionIcon,
      fingerprint: <FingerPrintLeft className="fingerprint-areas-left" />,
    },
    {
      title: 'Сфера публічних фінансів',
      text: 'Сфера публічних фінансів охоплює управління державними коштами, включаючи бюджетування, державні закупівлі, оподаткування, управління боргом та фінансову звітність.',
      icon: HouseIcon,
      fingerprint: null,
    },
    {
      title: 'Громадська власність',
      text: 'Цей напрямок стосується управління та використання майна, що належить державі або громадам (місцевому самоврядуванню).',
      icon: PublicPropertyIcon,
      fingerprint: null,
    },
    {
      title: 'Сфера відновлення',
      text: 'Сфера відновлення в Україні зосереджена на відбудові інфраструктури, житла, економіки та соціальних систем, зруйнованих внаслідок війни.',
      icon: RepairIcon,
      fingerprint: <FingerPrintRight className="fingerprint-areas-right" />,
    },
  ];

  // Define clockwise animation delays: top-left (0), top-right (1), bottom-right (3), bottom-left (2)
  const animationDelays = [0, 0.2, 0.6, 0.4]; // In seconds

  return (
    <section className="areas-section" ref={ref}>
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
            >
              <AreaCard
                title={card.title}
                text={truncateText(card.text, 20)}
                icon={card.icon}
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
        <div
          className="details-container"
          onClick={handleCloseDetails} // клік по фону закриває
        >
          <div
            className={`details-content ${isClosing ? 'closing' : ''}`}
            onAnimationEnd={handleAnimationEnd}
          >
            <CloseIcon className="details-close" onClick={handleCloseDetails} />
            {cards.map((card) =>
              selectedCard === card.title || closingCard === card.title ? (
                <div key={card.title} className="details-body">
                  <card.icon className="details-icon" />
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
