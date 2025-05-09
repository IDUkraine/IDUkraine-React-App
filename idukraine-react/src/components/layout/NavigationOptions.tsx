const NavigationOptions = () => {
  const navItems = [
    { label: 'Про нас', id: 'about' },
    { label: 'Команда', id: 'team' },
    { label: 'Новини', id: 'news' },
    { label: 'Напрями роботи', id: 'work-areas' },
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
