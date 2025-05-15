export interface Worker {
  id: number;
  name: string;
  email: string;
  position: string;
  specialty: string;
  years: number;
  description: string;
  photo: string;
  iconPhotoOffsetY: string;
  links: {
    facebook?: string;
  };
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
