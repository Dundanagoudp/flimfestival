// Category Types
export interface WorkshopCategory {
  _id: string;
  name: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  order: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  order?: number;
}

/** Uncategorized bucket from API: category._id is null */
export interface UncategorizedCategory {
  _id: null;
  name: string;
  order: number;
}

export type GroupedWorkshopCategory = WorkshopCategory | UncategorizedCategory;

export interface GroupedWorkshopItem {
  category: GroupedWorkshopCategory;
  workshops: Workshop[];
}

export type GroupedWorkshopsResponse = GroupedWorkshopItem[];

// Workshop Types
export interface Workshop {
  _id: string;
  eventRef?: string;
  name: string;
  about: string;
  imageUrl: string;
  registrationFormUrl: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  categoryRef?: string;
}

// Request Types
export interface CreateWorkshopPayload {
  name: string;
  about: string;
  registrationFormUrl: string;
  imageFile?: File | null;
  categoryId?: string | null;
}

export interface UpdateWorkshopPayload {
  name?: string;
  about?: string;
  registrationFormUrl?: string;
  imageFile?: File | null;
  categoryId?: string | null;
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
