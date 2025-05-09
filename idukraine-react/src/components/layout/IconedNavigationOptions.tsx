import AboutIcon from '../../assets/svgs/about.svg';
import TeamIcon from '../../assets/svgs/team.svg';
import NewsIcon from '../../assets/svgs/news.svg';
import AreasIcon from '../../assets/svgs/areas.svg';

const IconedNavigationOptions = () => {
  const navItems = [
    { label: 'Про нас', id: 'about', icon: AboutIcon },
    { label: 'Команда', id: 'team', icon: TeamIcon },
    { label: 'Новини', id: 'news', icon: NewsIcon },
    { label: 'Напрями роботи', id: 'work-areas', icon: AreasIcon },
  ];

  return (
    <ul className="iconed-navigation-options">
      {navItems.map((item) => (
        <li key={item.id}>
          <item.icon className="nav-icon" />
          <a href={`#${item.id}`} className="nav-link">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default IconedNavigationOptions;
