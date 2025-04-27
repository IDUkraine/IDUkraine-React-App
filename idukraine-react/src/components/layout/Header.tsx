import TitledLogo from '../../assets/svgs/header-logo.svg';
import PhoneIcon from '../../assets/svgs/call.svg';
import NavigationOptions from './NavigationOptions';
const Header = () => {
  return (
    <div className="header-container">
      <TitledLogo className="header-logo" />
      <div className="header-nav-options">
        <NavigationOptions />
      </div>
      <div className="header-phone-container">
        <PhoneIcon className="header-phone-icon" />
        <p>+380 67 843-02-44</p>
      </div>
    </div>
  );
};

export default Header;
