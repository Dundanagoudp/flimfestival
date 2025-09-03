// src/types/submission.types.ts

export type VideoType = "Short Film" | "Documentary";

export interface Submission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  videoType: VideoType;
  videoFile: string;        // stored URL/path from backend
  message: string;
  contacted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateSubmissionPayload {
  fullName: string;
  email: string;
  phone: string;
  videoType: VideoType;
  videoFile: File;          // file to upload
  message: string;
}

export interface UpdateSubmissionPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  videoType?: VideoType;
  // NOTE: Your PUT route does NOT use multer, so sending a File won't work.
  // If you ever change the backend to accept multipart on update,
  // you can switch this to `File | string`.
  videoFile?: string;       // optional URL/path if your controller supports updating it
  message?: string;
  contacted?: boolean;
}

export interface SubmissionCreateResponse extends Submission {}
export interface GetAllSubmissionsResponse extends Array<Submission> {}
export interface GetSubmissionByIdResponse extends Submission {}
export interface SubmissionUpdateResponse extends Submission {}
export interface SubmissionDeleteResponse {
  message: string;
}
