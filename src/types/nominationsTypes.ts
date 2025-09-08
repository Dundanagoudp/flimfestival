// Nomination Types

export interface Nomination {
  _id: string;
  title: string;
  description: string;
  image: string;
  type: string; // e.g., "short_film"
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Request payloads
export interface CreateNominationPayload {
  title: string;
  description: string;
  type: string;
  imageFile?: File | null;
}

export interface UpdateNominationPayload {
  title?: string;
  description?: string;
  type?: string;
  imageFile?: File | null;
}

// Responses
export interface CreateNominationResponse {
  message: string;
  nomination?: Nomination;
}

export interface UpdateNominationResponse {
  message: string;
  nomination?: Nomination;
}

export interface DeleteNominationResponse {
  success: boolean;
}

export type GetNominationsResponse = Nomination[];
export type GetNominationByIdResponse = Nomination;

export interface SimpleMessageResponse {
  message: string;
  success?: boolean;
}


