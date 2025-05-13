import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import '../../../../assets/styles/swiper-custom.css';
import '../../../../assets/styles/team.css';
import TeamLogo from '../../../../assets/svgs/logos/team-logo.svg';
import SpecialtyIcon from '../../../../assets/svgs/icons/hail.svg';
import ExperienceIcon from '../../../../assets/svgs/icons/person-play.svg';
import MailIcon from '../../../../assets/svgs/icons/mail.svg';
import CloseIcon from '../../../../assets/svgs/icons/close.svg';
import FacebookIcon from '../../../../assets/svgs/icons/facebook.svg';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';
import employeesData from '../../../../data/emplyees.json';

interface Employee {
  id: number;
  name: string;
  position: string;
  specialty: string;
  years: number;
  email: string;
  description: string;
  photo: string;
  iconPhotoOffsetY?: string;
  links: {
    [key: string]: string;
  };
}

const headEmployees: Employee[] = employeesData.employees;
const radiuses: number[] = employeesData.radiuses;
const allEmployees: Employee[] = [...headEmployees];

function TeamSection() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    headEmployees[0]
  );
  const [showAll, setShowAll] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [radiusScale, setRadiusScale] = useState<number>(1);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const baseCenter = { x: 225, y: 240 };
  const baseWidth = 450;

  const [leftRef, leftVisible] = useSectionAnimation();
  const [rightRef, rightVisible] = useSectionAnimation();

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
    window.addEventListener('scroll', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
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

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="team-section" id="team">
      <h2 className="team-title">/Наша команда</h2>
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
            <div className="photo-dots">
              {headEmployees.map((emp, index) => {
                const angle = (2 * Math.PI * index) / headEmployees.length;
                const radius = radiuses[index] * scale * radiusScale;
                const x = center.x + radius * Math.cos(angle) - 45 * scale;
                const y = center.y + radius * Math.sin(angle) - 45 * scale;

                return (
                  <div
                    key={emp.id}
                    className={`photo-dot-wrapper ${
                      selectedEmployee.id === emp.id ? 'active' : ''
                    }`}
                    style={{ top: `${y}px`, left: `${x}px` }}
                    onClick={() => {
                      if (window.innerWidth <= 769) {
                        openModal(emp);
                      } else {
                        setSelectedEmployee(emp);
                      }
                    }}
                  >
                    <div className="photo-dot">
                      <img
                        src={emp.photo}
                        alt={emp.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: `center ${
                            emp.iconPhotoOffsetY ?? '0%'
                          }`,
                          borderRadius: '50%',
                        }}
                      />
                    </div>
                    <div className="worker-info-tooltip">
                      <div className="worker-info-text">
                        <p className="worker-name">{emp.name}</p>
                        <p className="worker-position">{emp.position}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="team-right"
          ref={rightRef}
          initial={{ opacity: 0, x: 60 }}
          animate={rightVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="employee-info">
            <div>
              <h3>{selectedEmployee.name}</h3>
              <p className="position">{selectedEmployee.position}</p>
            </div>
            <div className="employee-specs-container">
              <div className="employee-specs">
                <SpecialtyIcon className="employee-specs-icon" />
                <p>{selectedEmployee.specialty}</p>
              </div>
              <div className="employee-specs">
                <ExperienceIcon className="employee-specs-icon" />
                <p>{selectedEmployee.years} years of experience</p>
              </div>
              <div className="employee-specs">
                <MailIcon className="employee-specs-icon" />
                <p>{selectedEmployee.email}</p>
              </div>
            </div>
            <div className="employee-links">
              {selectedEmployee.links['facebook'] && (
                <FacebookIcon className="employee-links-icon" />
              )}
            </div>
            <p
              className="employee-description"
              dangerouslySetInnerHTML={{ __html: selectedEmployee.description }}
            />
          </div>
          <div className="employee-photo">
            <img src={selectedEmployee.photo} alt={selectedEmployee.name} />
          </div>
        </motion.div>
      </div>

      <div className="show-all-container">
        <button
          className="show-all-button"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Приховати' : 'Показати всіх'}
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
                  alt={emp.name}
                  className="employee-slide-photo"
                />
                <div className="employee-slide-info">
                  <div>
                    <p className="employee-slide-name">{emp.name}</p>
                    <p className="employee-slide-position">{emp.position}</p>
                  </div>
                  <div className="employee-specs-container">
                    <div className="employee-specs">
                      <SpecialtyIcon className="employee-specs-icon" />
                      <p>{emp.specialty}</p>
                    </div>
                    <div className="employee-specs">
                      <ExperienceIcon className="employee-specs-icon" />
                      <p>{emp.years} years of experience</p>
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
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
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
                  alt={selectedEmployee.name}
                />
              </div>
              <CloseIcon className="modal-close" onClick={closeModal} />
              <div className="modal-employee-info">
                <div className="modal-employee-header">
                  <h3>{selectedEmployee.name}</h3>
                  <p className="position">{selectedEmployee.position}</p>
                </div>
                <div className="modal-employee-specs-container">
                  <div className="modal-employee-specs">
                    <SpecialtyIcon className="modal-employee-specs-icon" />
                    <p>{selectedEmployee.specialty}</p>
                  </div>
                  <div className="modal-employee-specs">
                    <ExperienceIcon className="modal-employee-specs-icon" />
                    <p>{selectedEmployee.years} years of experience</p>
                  </div>
                  <div className="modal-employee-specs">
                    <MailIcon className="modal-employee-specs-icon" />
                    <p>{selectedEmployee.email}</p>
                  </div>
                </div>
                <p
                  className="modal-employee-description"
                  dangerouslySetInnerHTML={{
                    __html: selectedEmployee.description,
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
