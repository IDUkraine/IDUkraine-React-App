import { useLanguage } from '../../context/LanguageContext';

const NavigationOptions = () => {
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav.about'), id: 'about' },
    { label: t('nav.team'), id: 'team' },
    { label: t('nav.news'), id: 'news' },
    { label: t('nav.workAreas'), id: 'work-areas' },
  ];

  return (
    <ul className="navigation-options">
      {navItems.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="nav-link">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default NavigationOptions;
