import AboutIcon from '../../assets/svgs/icons/about.svg';
import TeamIcon from '../../assets/svgs/icons/team.svg';
import NewsIcon from '../../assets/svgs/icons/news.svg';
import AreasIcon from '../../assets/svgs/icons/areas.svg';
import { FC } from 'react';

interface IconedNavigationOptionsProps {
  onNavClick?: () => void;
}

const IconedNavigationOptions: FC<IconedNavigationOptionsProps> = ({
  onNavClick,
}) => {
  const navItems = [
    { label: 'Про нас', id: 'about', icon: AboutIcon },
    { label: 'Команда', id: 'team', icon: TeamIcon },
    { label: 'Новини', id: 'news', icon: NewsIcon },
    { label: 'Напрями роботи', id: 'work-areas', icon: AreasIcon },
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
