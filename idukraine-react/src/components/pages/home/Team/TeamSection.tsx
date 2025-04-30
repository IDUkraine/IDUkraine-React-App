import { useState } from 'react';
import '../../../../assets/styles/team.css';

const headEmployees = [
  {
    id: 1,
    name: 'Serhii Rokun',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 15.5,
    email: 'example@gmail.com',
    description:
      '7 years of experience of management of teams. 8.5 years of experience in the NABU and international technical assistance projects in the field of institutional development of anti-corruption agencies.\nExpert in financial investigations, international cooperation and troubleshooting.',
    photo: '/workers/serhii-rokun.jpg',
  },
  {
    id: 2,
    name: 'Nadiia Burdiei',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 10,
    email: 'example@gmail.com',
    description:
      'Experience in the field of corruption prevention, in particular, in assessing corruption risks, monitoring the lifestyle of officials, identifying public officials and their assets in positions at the National Agency for the Prevention of Corruption, the State Agency for Infrastructure Reconstruction and Development, and the Anti-Corruption Action Center.  Experience in media.',
    photo: '/workers/nadia-burdiei.jpg',
  },
  {
    id: 3,
    name: 'Stanislav Bronevystkyy',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 20,
    email: 'example@gmail.com',
    description:
      '20 years of experience in criminal justice system. \nUntil November 2024 - prosecutor at the SAPO. Expert in investigating white-collar crimes and corruption crimes committed by top officials. Experience in international technical assistance project on institutional development of the NACP.',
    photo: '/workers/stanislav-bronevystkyy.jpg',
  },
  {
    id: 4,
    name: 'Михайло Короленко',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 15.5,
    email: 'example@gmail.com',
    description: 'Михайло пише бекенд та слідкує за архітектурою.',
    photo: '/workers/serhii-rokun.jpg',
  },
  {
    id: 5,
    name: 'Олександр Романюк',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 15.5,
    email: 'example@gmail.com',
    description: 'Олександр пише фронтенд і дизайн.',
    photo: '/workers/serhii-rokun.jpg',
  },
  {
    id: 6,
    name: 'Михайло Короленко',
    position: 'Founder',
    specialty: 'Lawyer',
    years: 15.5,
    email: 'example@gmail.com',
    description: 'Михайло пише бекенд та слідкує за архітектурою.',
    photo: '/workers/serhii-rokun.jpg',
  },
];

function TeamSection() {
  const [selectedEmployee, setSelectedEmployee] = useState(headEmployees[0]);

  return (
    <section className="team-section">
      <h2 className="team-title">Наша команда</h2>
      <div className="team-content">
        <div className="team-left">
          <div className="fingerprint-container">
            <img
              src="/images/fingerprint.svg"
              alt="Fingerprint"
              className="fingerprint-img"
            />
            <div className="photo-dots">
              {headEmployees.map((emp, index) => (
                <div
                  key={emp.id}
                  className={`photo-dot ${
                    selectedEmployee.id === emp.id ? 'active' : ''
                  }`}
                  style={{
                    top: `${30 + index * 20}px`,
                    left: `${30 + (index % 2) * 40}px`,
                    backgroundImage: `url(${emp.photo})`,
                  }}
                  onClick={() => setSelectedEmployee(emp)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="team-right">
          <div className="employee-info">
            <h3>{selectedEmployee.name}</h3>
            <p className="position">{selectedEmployee.position}</p>
            <p>{selectedEmployee.description}</p>
          </div>
          <div className="employee-photo">
            <img src={selectedEmployee.photo} alt={selectedEmployee.name} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
