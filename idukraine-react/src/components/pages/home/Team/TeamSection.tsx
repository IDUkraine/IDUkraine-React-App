import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import '../../../../assets/styles/swiper-custom.css';
import '../../../../assets/styles/team.css';
import '../../../../assets/styles/modal.css';
import TeamLogo from '../../../../assets/svgs/logos/team-logo.svg';
import SpecialtyIcon from '../../../../assets/svgs/icons/hail.svg';
import ExperienceIcon from '../../../../assets/svgs/icons/person-play.svg';
import MailIcon from '../../../../assets/svgs/icons/mail.svg';
import CloseIcon from '../../../../assets/svgs/icons/close.svg';
import FacebookIcon from '../../../../assets/svgs/icons/facebook.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import { useLanguage } from '../../../../context/LanguageContext';
import { workerService } from '../../../../services/workerService';
import { Worker } from '../../../../types/worker';

interface TooltipPortalProps {
  children: ReactNode;
  targetRect: DOMRect;
}

const TooltipPortal = ({ children, targetRect }: TooltipPortalProps) => {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: targetRect.top + targetRect.height,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      {children}
    </div>,
    document.body
  );
};

function TeamSection() {
  const [selectedEmployee, setSelectedEmployee] = useState<Worker | null>(null);
  const [circleEmployees, setCircleEmployees] = useState<Worker[]>([]);
  const [allEmployees, setAllEmployees] = useState<Worker[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [radiusScale, setRadiusScale] = useState<number>(1);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isLoading, setIsLoading] = useState(true);
  const { t, activeLanguage } = useLanguage();
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null);
  const [activeEmployee, setActiveEmployee] = useState<Worker | null>(null);

  const baseCenter = { x: 225, y: 240 };
  const baseWidth = 450;
  const radiuses = [190, 180, 230, 190, 210, 190];

  const [leftRef, leftVisible] = useSectionAnimation();
  const [rightRef, rightVisible] = useSectionAnimation();

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setIsLoading(true);
        const data = await workerService.getWorkers();
        const workers = data.employees;
        setAllEmployees(workers);
        const displayedWorkers = workerService.getDisplayedWorkers(workers);
        setCircleEmployees(
          displayedWorkers.filter(
            (worker) => worker.isDisplayedInCircle == true
          )
        );
        if (displayedWorkers.length > 0) {
          if (
            displayedWorkers.find(
              (worker) => worker.positionUk === 'Голова правління'
            )
          ) {
            setSelectedEmployee(
              displayedWorkers[
                displayedWorkers.findIndex(
                  (worker) => worker.positionUk === 'Голова правління'
                )
              ]
            );
          } else {
            setSelectedEmployee(displayedWorkers[0]);
          }
        }
      } catch (error) {
        console.error('Error loading workers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkers();
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width <= 380) {
        setScale(240 / baseWidth);
        setRadiusScale(1);
      } else if (width <= 480) {
        setScale(340 / baseWidth);
        setRadiusScale(0.95);
      } else if (width <= 769) {
        setScale(340 / baseWidth);
        setRadiusScale(1);
      } else if (width <= 900) {
        setScale(280 / baseWidth);
        setRadiusScale(0.95);
      } else if (width <= 1025) {
        setScale(320 / baseWidth);
        setRadiusScale(0.95);
      } else if (width <= 1200) {
        setScale(360 / baseWidth);
        setRadiusScale(0.95);
      } else if (width <= 1381) {
        setScale(400 / baseWidth);
        setRadiusScale(1);
      } else {
        setScale(1);
        setRadiusScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const center = {
    x: baseCenter.x * scale,
    y: baseCenter.y * scale,
  };

  const openModal = (employee: Worker) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getName = (worker: Worker) =>
    activeLanguage === 'en' ? worker.nameEn : worker.nameUk;
  const getPosition = (worker: Worker) =>
    activeLanguage === 'en' ? worker.positionEn : worker.positionUk;
  const getSpecialty = (worker: Worker) =>
    activeLanguage === 'en' ? worker.specialtyEn : worker.specialtyUk;
  const getDescription = (worker: Worker) =>
    activeLanguage === 'en' ? worker.descriptionEn : worker.descriptionUk;

  if (!selectedEmployee && !isLoading) {
    return null;
  }

  return (
    <section className="team-section" id="team">
      <h2 className="team-title">{t('nav.team.title')}</h2>
      <div className="team-content">
        <motion.div
          className="team-left"
          ref={leftRef}
          initial={{ opacity: 0, y: -60 }}
          animate={leftVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="team-fingerprint-container">
            <TeamLogo className="team-fingerprint" />
            {isLoading ? (
              <div className="loading">{t('admin.loading')}</div>
            ) : (
              <div className="photo-dots">
                {circleEmployees.map((emp, index) => {
                  const angle = (2 * Math.PI * index) / circleEmployees.length;
                  const radius =
                    radiuses[index % radiuses.length] * scale * radiusScale;
                  const x = center.x + radius * Math.cos(angle) - 45 * scale;
                  const y = center.y + radius * Math.sin(angle) - 45 * scale;

                  return (
                    <div
                      key={emp.id}
                      className={`photo-dot-wrapper ${
                        selectedEmployee?.id === emp.id ? 'active' : ''
                      }`}
                      style={{ top: `${y}px`, left: `${x}px` }}
                      onClick={() => {
                        if (window.innerWidth <= 769) {
                          openModal(emp);
                        } else {
                          setSelectedEmployee(emp);
                        }
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipRect(rect);
                        setActiveEmployee(emp);
                      }}
                      onMouseLeave={() => {
                        setTooltipRect(null);
                        setActiveEmployee(null);
                      }}
                    >
                      <div className="photo-dot">
                        <img
                          src={emp.photo}
                          alt={getName(emp)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: `center ${emp.iconPhotoOffsetY}`,
                            borderRadius: '50%',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {tooltipRect && activeEmployee && (
                  <TooltipPortal targetRect={tooltipRect}>
                    <div
                      className="worker-info-tooltip"
                      style={{ position: 'static', transform: 'none' }}
                    >
                      <div className="worker-info-text">
                        <p className="worker-name">{getName(activeEmployee)}</p>
                        <p className="worker-position">
                          {getPosition(activeEmployee)}
                        </p>
                      </div>
                    </div>
                  </TooltipPortal>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="team-right"
          ref={rightRef}
          initial={{ opacity: 0, x: 60 }}
          animate={rightVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          {isLoading ? (
            <div className="loading">{t('admin.loading')}</div>
          ) : selectedEmployee ? (
            <>
              <div className="employee-info">
                <div>
                  <h3>{getName(selectedEmployee)}</h3>
                  <p className="position">{getPosition(selectedEmployee)}</p>
                </div>
                <div className="employee-specs-container">
                  <div className="employee-specs">
                    <SpecialtyIcon className="employee-specs-icon" />
                    <p>{getSpecialty(selectedEmployee)}</p>
                  </div>
                  <div className="employee-specs">
                    <ExperienceIcon className="employee-specs-icon" />
                    <p>
                      {selectedEmployee.years} {t('team.years')}
                    </p>
                  </div>
                  <div className="employee-specs">
                    <MailIcon className="employee-specs-icon" />
                    <p>{selectedEmployee.email}</p>
                  </div>
                </div>
                <div className="employee-links">
                  {selectedEmployee.links?.facebook && (
                    <a
                      href={selectedEmployee.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon className="employee-links-icon" />
                    </a>
                  )}
                </div>
                <p
                  className="employee-description"
                  dangerouslySetInnerHTML={{
                    __html: getDescription(selectedEmployee),
                  }}
                />
              </div>
              <div className="employee-photo">
                <img
                  src={selectedEmployee.photo}
                  alt={getName(selectedEmployee)}
                  style={{
                    objectFit: 'cover',
                    objectPosition: `center ${
                      selectedEmployee.iconPhotoOffsetY ?? '0%'
                    }`,
                  }}
                />
              </div>
            </>
          ) : null}
        </motion.div>
      </div>

      <div className="show-all-container">
        <button
          className="show-all-button"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? t('team.hideAll') : t('team.showAll')}
        </button>
      </div>

      {showAll && (
        <div className="employee-slider">
          <Swiper
            slidesPerView="auto"
            spaceBetween={20}
            freeMode={{
              enabled: true,
              sticky: false,
            }}
            modules={[FreeMode]}
            className="employee-slider-inner"
          >
            {allEmployees.map((emp) => (
              <SwiperSlide
                key={emp.id}
                className="employee-slide"
                onClick={() => {
                  if (window.innerWidth <= 769) {
                    openModal(emp);
                  } else {
                    setSelectedEmployee(emp);
                  }
                }}
              >
                <img
                  src={emp.photo}
                  alt={getName(emp)}
                  className="employee-slide-photo"
                  style={{
                    objectFit: 'cover',
                    objectPosition: `center ${emp.iconPhotoOffsetY ?? '0%'}`,
                  }}
                />
                <div className="employee-slide-info">
                  <div>
                    <p className="employee-slide-name">{getName(emp)}</p>
                    <p className="employee-slide-position">
                      {getPosition(emp)}
                    </p>
                  </div>
                  <div className="employee-specs-container">
                    <div className="employee-specs">
                      <SpecialtyIcon className="employee-specs-icon" />
                      <p
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          margin: 0,
                        }}
                      >
                        {getSpecialty(emp)}
                      </p>
                    </div>
                    <div className="employee-specs">
                      <ExperienceIcon className="employee-specs-icon" />
                      <p>
                        {emp.years} {t('team.years')}
                      </p>
                    </div>
                    <div className="employee-specs">
                      <MailIcon className="employee-specs-icon" />
                      <p>{emp.email}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && selectedEmployee && (
          <motion.div
            className="modal-container modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ height: viewportHeight }}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ minHeight: viewportHeight }}
            >
              <div className="modal-employee-photo">
                <img
                  style={{
                    objectFit: 'cover',
                    objectPosition: `center ${
                      selectedEmployee.iconPhotoOffsetY ?? '0%'
                    }`,
                  }}
                  src={selectedEmployee.photo}
                  alt={getName(selectedEmployee)}
                />
              </div>
              <CloseIcon className="modal-close" onClick={closeModal} />
              <div className="modal-employee-info">
                <div className="modal-employee-header">
                  <h3>{getName(selectedEmployee)}</h3>
                  <p className="position">{getPosition(selectedEmployee)}</p>
                </div>
                <div className="modal-employee-specs-container">
                  <div className="modal-employee-specs">
                    <SpecialtyIcon className="modal-employee-specs-icon" />
                    <p>{getSpecialty(selectedEmployee)}</p>
                  </div>
                  <div className="modal-employee-specs">
                    <ExperienceIcon className="modal-employee-specs-icon" />
                    <p>
                      {selectedEmployee.years} {t('team.years')}
                    </p>
                  </div>
                  <div className="modal-employee-specs">
                    <MailIcon className="modal-employee-specs-icon" />
                    <p>{selectedEmployee.email}</p>
                  </div>
                </div>
                <div className="employee-links">
                  {selectedEmployee.links?.facebook && (
                    <a
                      href={selectedEmployee.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon className="employee-links-icon" />
                    </a>
                  )}
                </div>
                <p
                  className="modal-employee-description"
                  dangerouslySetInnerHTML={{
                    __html: getDescription(selectedEmployee),
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default TeamSection;
