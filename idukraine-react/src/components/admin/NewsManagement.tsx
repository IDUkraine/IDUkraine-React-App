import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types/news';
import { newsService } from '../../services/newsService';
import '../../assets/styles/news-management.css';
import NewsFormModal from './NewsFormModal';

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const newsData = await newsService.getAllNews();
      setNews(newsData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load news');
    }
  };

  const handleEdit = (item: NewsItem) => {
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await newsService.deleteNews(id);
        await loadNews();
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to delete news'
        );
      }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await newsService.togglePublishStatus(id);
      await loadNews();
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to toggle publish status'
      );
    }
  };

  const handleToggleTopNews = async (id: string) => {
    try {
      await newsService.toggleTopNewsStatus(id);
      await loadNews();
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to toggle top news status'
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="news-container">
      <button
        className="toggle-form-button"
        onClick={() => setIsModalOpen(true)}
      >
        Add New News
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="news-grid">
        {news.map((item) => (
          <div key={item.id} className="news-card">
            {item.image && (
              <img src={item.image} alt={item.title} className="news-image" />
            )}
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-meta">
                Category: {item.category}
                <br />
                Date: {formatDate(new Date(item.date))}
              </p>
              <div className="news-actions">
                <button
                  onClick={() => handleEdit(item)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-button"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleTogglePublish(item.id)}
                  className={`publish-button ${
                    item.isPublished ? 'published' : 'draft'
                  }`}
                >
                  {item.isPublished ? 'Published' : 'Draft'}
                </button>
                <button
                  onClick={() => handleToggleTopNews(item.id)}
                  className={`top-news-button ${
                    item.isTopNews ? 'active' : ''
                  }`}
                  title={
                    item.isTopNews ? 'Remove from Top News' : 'Add to Top News'
                  }
                >
                  {item.isTopNews ? 'Top' : 'Regular'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewsFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedNews={selectedNews}
        onSuccess={loadNews}
      />
    </div>
  );
};

export default NewsManagement;
