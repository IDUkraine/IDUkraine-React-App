import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../../../assets/styles/team.css';
import TeamFingerprint from '../../../../assets/svgs/team-logo.svg';
import SpecialtyIcon from '../../../../assets/svgs/hail.svg';
import ExperienceIcon from '../../../../assets/svgs/person-play.svg';
import MailIcon from '../../../../assets/svgs/mail.svg';
import { useKeenSlider } from 'keen-slider/react';
import { useSectionAnimation } from '../../../../hooks/useSectionAnimation';

import 'keen-slider/keen-slider.min.css';

const headEmployees = [
  {
    id: 1,
    name: 'Serhii Rokun',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 15.5,
    email: 'example@gmail.com',
    description:
      '<strong>7 years of experience of management of teams.</strong> 8.5 years of experience in the NABU and international technical assistance projects in the field of institutional development of anti-corruption agencies.\n\n<strong>Expert in financial investigations, international cooperation and troubleshooting.</strong>',
    photo: './workers/serhii-rokun.jpeg',
    iconPhotoOffsetY: '30%',
  },
  {
    id: 2,
    name: 'Nadiia Burdiei',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 10,
    email: 'example@gmail.com',
    description:
      'Experience in the field of corruption prevention, in particular, in assessing corruption risks, monitoring the lifestyle of officials, identifying public officials and their assets in positions at the National Agency for the Prevention of Corruption, the State Agency for Infrastructure Reconstruction and Development, and the Anti-Corruption Action Center. Experience in media.',
    photo: './workers/nadia-burdiei.jpeg',
    iconPhotoOffsetY: '50%',
    radius: 180,
  },
  {
    id: 3,
    name: 'Stanislav Bronevystkyy',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 20,
    email: 'example@gmail.com',
    description:
      '<strong>20 years of experience in criminal justice system.</strong> \n\nUntil November 2024 - prosecutor at the SAPO. Expert in investigating white-collar crimes and corruption crimes committed by top officials. Experience in international technical assistance project on institutional development of the NACP.',
    photo: './workers/stanislav-bronevystkyy.jpeg',
    iconPhotoOffsetY: '20%',
    radius: 230,
  },
  {
    id: 4,
    name: 'Andrii Denysiuk',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 13,
    email: 'example@gmail.com',
    description:
      '13 years of experience in criminal justice system. Assistant to a member of the Ukrainian Parliament. Experience in drafting laws, public speaking and implementing educational projects. \n\nSpecialist in anti-corruption, procurement and projects in the field of IT, cryptocurrency, public procurement.',
    photo: './workers/andrii-denysiuk.jpg',
    iconPhotoOffsetY: '20%',
    radius: 190,
  },
  {
    id: 5,
    name: 'Andrii Sotnyk',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 12,
    email: 'example@gmail.com',
    description:
      'A lawyer with over 12 years of professional experience in the field of law, including work in government bodies, international technical assistance projects, and the civil society sector. <strong>Expert in the legislative regulation</strong> of the judiciary and law enforcement agencies in Ukraine, with deep expertise in anti-corruption policy, development of regulatory legal acts, and legislative analysis.',
    photo: './workers/andrii-sotnyk.jpeg',
    iconPhotoOffsetY: '20%',
    radius: 210,
  },
  {
    id: 6,
    name: 'Serhii Verenchuk',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 8.5,
    email: 'example@gmail.com',
    description:
      '<strong>8.5 years of experience as a NABU detective</strong> and international technical assistance projects in the field of state-owned enterprises, corporate governance.\n\nExpert in conducting investigations in criminal proceedings on economic crimes.',
    photo: './workers/serhii-verenchuk.jpeg',
    iconPhotoOffsetY: '0%',
  },
];
const allEmployees = [...headEmployees];

function TeamSection() {
  const [selectedEmployee, setSelectedEmployee] = useState(headEmployees[0]);
  const [showAll, setShowAll] = useState(false);
  const center = { x: 225, y: 240 };

  const [leftRef, leftVisible] = useSectionAnimation();
  const [rightRef, rightVisible] = useSectionAnimation();

  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      perView: 'auto',
      spacing: 52,
    },
    drag: true,
  });

  return (
    <section className="team-section">
      <h2 className="team-title">Наша команда</h2>
      <div className="team-content">
        <motion.div
          className="team-left"
          ref={leftRef}
          initial={{ opacity: 0, y: -60 }}
          animate={leftVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="team-fingerprint-container">
            <TeamFingerprint className="team-fingerprint" />
            <div className="photo-dots">
              {headEmployees.map((emp, index) => {
                const angle = (2 * Math.PI * index) / headEmployees.length;
                const radius = emp.radius ?? 190;
                const x = center.x + radius * Math.cos(angle) - 45;
                const y = center.y + radius * Math.sin(angle) - 45;

                return (
                  <div
                    key={emp.id}
                    className={`photo-dot-wrapper ${
                      selectedEmployee.id === emp.id ? 'active' : ''
                    }`}
                    style={{ top: `${y}px`, left: `${x}px` }}
                    onClick={() => setSelectedEmployee(emp)}
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
        <div ref={sliderRef} className="employee-slider keen-slider">
          {allEmployees.map((emp) => (
            <div
              className="employee-slide keen-slider__slide"
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TeamSection;
