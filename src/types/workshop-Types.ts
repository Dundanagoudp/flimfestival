// Workshop Types
export interface Workshop {
  _id: string;
  eventRef: string;
  name: string;
  about: string;
  imageUrl: string;
  registrationFormUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Request Types
export interface CreateWorkshopPayload {
  name: string;
  about: string;
  registrationFormUrl: string;
  imageFile?: File | null;
}

export interface UpdateWorkshopPayload {
  name?: string;
  about?: string;
  registrationFormUrl?: string;
  imageFile?: File | null;
}

// Response Types
export interface CreateWorkshopResponse {
  message: string;
  workshop?: Workshop;
}

export interface UpdateWorkshopResponse {
  message: string;
  workshop?: Workshop;
}

export interface DeleteWorkshopResponse {
  message: string;
  deletedWorkshop?: string;
}

export interface GetWorkshopsResponse extends Array<Workshop> {}

export interface SimpleMessageResponse {
  message: string;
  success?: boolean;
}
