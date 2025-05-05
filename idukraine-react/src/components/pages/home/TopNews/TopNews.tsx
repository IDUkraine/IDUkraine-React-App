import '../../../../assets/styles/top-news.css';
import TopNewsCard from './TopNewsCard';

interface NewsItem {
  title: string;
  text: string;
  date: string;
  category: string;
  image?: string;
}

const newsItems: NewsItem[] = [
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 24th, 2025',
    category: 'Important',
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 25th, 2025',
    category: 'Important',
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: 'March 26th, 2025',
    category: 'Important',
  },
];

function TopNewsSection() {
  return (
    <section className="top-news-section">
      <h2 className="top-news-section-title">/Найважливіші новини</h2>
      <div className="top-news-container">
        {newsItems.map((news, index) => (
          <TopNewsCard
            key={index}
            title={news.title}
            text={news.text}
            date={news.date}
            category={news.category}
            image={news.image || './news-image.jpg'}
          />
        ))}
      </div>
    </section>
  );
}

export default TopNewsSection;
