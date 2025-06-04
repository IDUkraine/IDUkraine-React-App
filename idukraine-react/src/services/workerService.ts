import { Worker, WorkerFormData, WorkersData } from '../types/worker';
import { API_URL } from '../config/api';

export const workerService = {
  async getWorkers(): Promise<WorkersData> {
    try {
      const response = await fetch(`${API_URL}/workers`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching workers:', error);
      throw error;
    }
  },

  async saveWorkers(workers: Worker[]): Promise<void> {
    try {
      await fetch(`${API_URL}/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employees: workers }),
      });
    } catch (error) {
      console.error('Error saving workers:', error);
      throw error;
    }
  },

  async uploadPhoto(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/upload?type=workers`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },

  async deletePhoto(path: string): Promise<void> {
    try {
      await fetch(`${API_URL}/file?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },

  createEmptyWorker(): WorkerFormData {
    return {
      nameEn: '',
      nameUk: '',
      email: '',
      positionEn: '',
      positionUk: '',
      specialtyEn: '',
      specialtyUk: '',
      years: 0,
      descriptionEn: '',
      descriptionUk: '',
      iconPhotoOffsetY: '0',
      links: {},
      isDisplayedInCircle: false,
    };
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

  async deleteWorkerPhotos(worker: { photo?: string; avatar?: string }) {
    if (worker.photo) {
      try {
        await workerService.deletePhoto(worker.photo);
      } catch (e) {
        console.error('Error deleting worker photo:', e);
      }
    }
    if (worker.avatar) {
      try {
        await workerService.deletePhoto(worker.avatar);
      } catch (e) {
        console.error('Error deleting worker avatar:', e);
      }
    }
  },
};
