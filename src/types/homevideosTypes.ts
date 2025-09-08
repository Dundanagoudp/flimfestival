// Homepage Video Types

export interface HomeVideo {
  _id: string;
  title: string;
  description: string;
  video: string; // URL
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Create / Update payloads
export interface CreateHomeVideoPayload {
  title: string;
  description: string;
  video: File | Blob; // file input
}

export interface UpdateHomeVideoPayload {
  title?: string;
  description?: string;
  video?: File | Blob; // optional new file
}

// Responses
export type GetHomeVideosResponse = HomeVideo[];
export type GetHomeVideoByIdResponse = HomeVideo | null;
export type CreateHomeVideoResponse = HomeVideo;
export type UpdateHomeVideoResponse = HomeVideo;
export interface DeleteHomeVideoResponse { message: string; success?: boolean }
