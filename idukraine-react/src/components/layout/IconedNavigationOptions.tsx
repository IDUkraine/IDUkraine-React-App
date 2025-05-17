import AboutIcon from '../../assets/svgs/icons/about.svg';
import TeamIcon from '../../assets/svgs/icons/team.svg';
import NewsIcon from '../../assets/svgs/icons/news.svg';
import AreasIcon from '../../assets/svgs/icons/areas.svg';
import { FC } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface IconedNavigationOptionsProps {
  onNavClick?: () => void;
}

const IconedNavigationOptions: FC<IconedNavigationOptionsProps> = ({
  onNavClick,
}) => {
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav.about'), id: 'about', icon: AboutIcon },
    { label: t('nav.team'), id: 'team', icon: TeamIcon },
    { label: t('nav.news'), id: 'news', icon: NewsIcon },
    { label: t('nav.workAreas'), id: 'work-areas', icon: AreasIcon },
  ];

  const handleClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (onNavClick) {
      onNavClick();
    }
  };

  return (
    <ul className="iconed-navigation-options">
      {navItems.map((item) => (
        <li key={item.id}>
          <item.icon className="nav-icon" />
          <a
            href={`#${item.id}`}
            className="nav-link"
            onClick={() => {
              handleClick(item.id);
            }}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default IconedNavigationOptions;
