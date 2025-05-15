import { Worker, WorkersData } from '../types/worker';

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

export const workerService = {
  async getWorkers(): Promise<WorkersData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/workers?t=${Date.now()}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched workers data:', data);
      return data;
    } catch (error) {
      console.error('Error loading workers:', error);
      throw error;
    }
  },

  async saveWorkers(data: WorkersData): Promise<void> {
    try {
      console.log('Saving workers data:', data);
      const response = await fetch(`${API_BASE_URL}/api/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData?.error || 'Unknown error'
          }`
        );
      }

      console.log('Workers data saved successfully');
    } catch (error) {
      console.error('Error saving workers:', error);
      throw error;
    }
  },

  async saveWorkerPhoto(photo: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', photo);

      const response = await fetch(`${API_BASE_URL}/api/upload?type=workers`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData?.error || 'Unknown error'
          }`
        );
      }

      const data = await response.json();
      console.log('Photo saved successfully:', data.filePath);
      return data.filePath;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  },

  async deleteWorkerPhoto(photoPath: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/file?path=${encodeURIComponent(photoPath)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData?.error || 'Unknown error'
          }`
        );
      }

      console.log('Photo deleted successfully:', photoPath);
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },

  getDisplayedWorkers(workers: Worker[]): Worker[] {
    return workers.filter((worker) => worker.isDisplayedInCircle).slice(0, 6);
  },

  getSliderWorkers(workers: Worker[]): Worker[] {
    return workers.filter((worker) => !worker.isDisplayedInCircle);
  },

  // Helper method to get photo data from localStorage
  getPhotoData(photoPath: string): string | null {
    const fileName = photoPath.split('/').pop();
    if (fileName) {
      return localStorage.getItem(`photo_${fileName}`);
    }
    return null;
  },
};
