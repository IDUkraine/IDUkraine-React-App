import TitledLogo from '../../assets/svgs/header-logo.svg';
import PhoneIcon from '../../assets/svgs/call.svg';
const Header = () => {
  return (
    <div className="header-container">
      <TitledLogo className="header-logo" />
      <div className="navigation-container">
        <ul className="header-navigation-options">
          <li>Про нас</li>
          <li>Новини</li>
          <li>Команда</li>
          <li>Напрями роботи</li>
        </ul>
      </div>
      <div className="header-phone-container">
        <PhoneIcon className="header-phone-icon" />
        <p>+380 67 843-02-44</p>
      </div>
    </div>
  );
};

export default Header;
