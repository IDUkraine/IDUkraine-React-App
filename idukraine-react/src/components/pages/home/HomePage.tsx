import HeroSection from './Hero/HeroSection';
import AboutSection from './About/AboutSection';
import AreasSection from './Areas/Areas';
import GeneralNewsSection from './GeneralNews/GeneralNewsSection';
const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <AboutSection />
      <GeneralNewsSection />
      <AreasSection />
    </div>
  );
};

export default HomePage;
