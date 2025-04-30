import HeroSection from './Hero/HeroSection';
import AboutSection from './About/AboutSection';
import AreasSection from './Areas/Areas';
import GeneralNewsSection from './GeneralNews/GeneralNewsSection';
import TeamSection from './Team/TeamSection';
const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <GeneralNewsSection />
      <AreasSection />
    </div>
  );
};

export default HomePage;
