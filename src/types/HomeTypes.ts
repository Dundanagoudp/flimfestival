export interface MediaItem {
    _id: string;
    title: string;
    description: string;
    video?: string;   // optional because some entries have empty or missing video
    image?: string;   // optional because some entries use image instead of video
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  }
  export type GetAllMediaResponse = MediaItem[];