import HeroSection from './Hero/HeroSection';
import AboutSection from './About/AboutSection';
import AreasSection from './Areas/Areas';
const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <AboutSection />
      <AreasSection />
    </div>
  );
};

export default HomePage;
