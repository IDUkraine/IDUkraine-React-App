import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../assets/styles/layout.css';

const Layout = () => {
  const [splashComplete, setSplashComplete] = useState(() => {
    return !!sessionStorage.getItem('hasSeenSplash');
  });

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  return (
    <div className="layout-container">
      <Header splashComplete={splashComplete} />
      <div className="layout-content">
        <Outlet context={{ onSplashComplete: handleSplashComplete }} />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
