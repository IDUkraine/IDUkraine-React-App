import HeroSection from './Hero/HeroSection';
import AboutSection from './About/AboutSection';
import AreasSection from './Areas/Areas';
import GeneralNewsSection from './GeneralNews/GeneralNewsSection';
import TeamSection from './Team/TeamSection';
import ContactUsSection from './ContactUs/ContactUsSection';
import TopNewsSection from './TopNews/TopNews';
const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <TopNewsSection />
      <GeneralNewsSection />
      <AreasSection />
      <ContactUsSection />
    </div>
  );
};

export default HomePage;
