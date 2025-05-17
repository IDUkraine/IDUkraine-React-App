import { NewsItem, NewsCreateInput, NewsUpdateInput } from '../types/news';
import { API_URL } from '../config/api';

const MAX_TOP_NEWS = 3;

class NewsService {
  private async fetchWithError(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    return response.json();
  }

  private async readNewsData(): Promise<NewsItem[]> {
    try {
      const response = await this.fetchWithError(`${API_URL}/news`);
      return response.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      }));
    } catch (error) {
      console.error('Error reading news data:', error);
      throw new Error('Failed to read news data');
    }
  }

  private async saveNewsData(news: NewsItem[]): Promise<void> {
    try {
      const dataToSave = news.map((item) => ({
        ...item,
        date: item.date.toISOString(),
      }));
      await this.fetchWithError(`${API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
    } catch (error) {
      console.error('Error saving news data:', error);
      throw new Error('Failed to save news data');
    }
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload?type=news`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(imagePath: string): Promise<void> {
    if (!imagePath) return;

    try {
      const response = await fetch(
        `${API_URL}/file?path=${encodeURIComponent(imagePath)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  private async validateTopNews(
    news: NewsItem[],
    newTopStatus: boolean,
    excludeId?: string
  ): Promise<boolean> {
    if (!newTopStatus) return true;

    const currentTopNews = news.filter(
      (item) => item.isTopNews && item.id !== excludeId
    );
    return currentTopNews.length < MAX_TOP_NEWS;
  }

  async getAllNews(): Promise<NewsItem[]> {
    return this.readNewsData();
  }

  async getTopNews(): Promise<NewsItem[]> {
    const allNews = await this.readNewsData();
    return allNews.filter((item) => item.isPublished && item.isTopNews);
  }

  async getNewsById(id: string): Promise<NewsItem | null> {
    const news = await this.readNewsData();
    return news.find((item) => item.id === id) || null;
  }

  async createNews(input: NewsCreateInput): Promise<NewsItem> {
    const news = await this.readNewsData();

    if (input.isTopNews) {
      const isValid = await this.validateTopNews(news, true);
      if (!isValid) {
        // If validation fails, clean up the uploaded image
        if (input.image) {
          await this.deleteImage(input.image);
        }
        throw new Error(`Cannot add more than ${MAX_TOP_NEWS} top news items`);
      }
    }

    const newNews: NewsItem = {
      ...input,
      id: crypto.randomUUID(),
      date: new Date(input.date),
      isPublished: false,
      isTopNews: input.isTopNews || false,
    };

    await this.saveNewsData([...news, newNews]);
    return newNews;
  }

  async updateNews(
    id: string,
    input: NewsUpdateInput
  ): Promise<NewsItem | null> {
    const news = await this.readNewsData();
    const index = news.findIndex((item) => item.id === id);

    if (index === -1) return null;

    if (input.isTopNews !== undefined) {
      const isValid = await this.validateTopNews(news, input.isTopNews, id);
      if (!isValid) {
        // If validation fails and we have a new image, clean it up
        if (input.image && input.image !== news[index].image) {
          await this.deleteImage(input.image);
        }
        throw new Error(`Cannot have more than ${MAX_TOP_NEWS} top news items`);
      }
    }

    // Store the old image path before updating
    const oldImagePath = news[index].image;

    const updatedNews = {
      ...news[index],
      ...input,
      date: input.date ? new Date(input.date) : news[index].date,
    };

    // If updating the image and we have a new one, delete the old one
    if (input.image && oldImagePath && input.image !== oldImagePath) {
      try {
        await this.deleteImage(oldImagePath);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    news[index] = updatedNews;
    await this.saveNewsData(news);
    return updatedNews;
  }

  async deleteNews(id: string): Promise<boolean> {
    const news = await this.readNewsData();
    const newsItem = news.find((item) => item.id === id);

    if (!newsItem) return false;

    // Delete the associated image if it exists
    if (newsItem.image) {
      try {
        await this.deleteImage(newsItem.image);
      } catch (error) {
        console.error('Error deleting news image:', error);
      }
    }

    const filteredNews = news.filter((item) => item.id !== id);
    await this.saveNewsData(filteredNews);
    return true;
  }

  async togglePublishStatus(id: string): Promise<NewsItem | null> {
    const news = await this.readNewsData();
    const index = news.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const updatedNews = {
      ...news[index],
      isPublished: !news[index].isPublished,
    };

    news[index] = updatedNews;
    await this.saveNewsData(news);
    return updatedNews;
  }

  async toggleTopNewsStatus(id: string): Promise<NewsItem | null> {
    const news = await this.readNewsData();
    const index = news.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const newTopStatus = !news[index].isTopNews;
    const isValid = await this.validateTopNews(news, newTopStatus, id);

    if (!isValid) {
      throw new Error(`Cannot have more than ${MAX_TOP_NEWS} top news items`);
    }

    const updatedNews = {
      ...news[index],
      isTopNews: newTopStatus,
    };

    news[index] = updatedNews;
    await this.saveNewsData(news);
    return updatedNews;
  }
}

export const newsService = new NewsService();
