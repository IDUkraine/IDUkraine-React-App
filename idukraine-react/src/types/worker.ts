export interface Worker {
  id: number;
  nameEn: string;
  nameUk: string;
  email: string;
  positionEn: string;
  positionUk: string;
  specialtyEn: string;
  specialtyUk: string;
  years: number;
  descriptionEn: string;
  descriptionUk: string;
  photo: string;
  iconPhotoOffsetY: string;
  links: {
    facebook?: string;
  };
  facebook?: string;
  isDisplayedInCircle?: boolean;
}

export interface WorkersData {
  employees: Worker[];
  radiuses: number[];
}

export interface WorkerFormData extends Omit<Worker, 'id' | 'photo'> {
  id?: number;
  photo?: File;
  currentPhotoPath?: string;
}
