import apiClient from "@/apiClient";
import type {
  CreateHomeVideoPayload,
  CreateHomeVideoResponse,
  UpdateHomeVideoPayload,
  UpdateHomeVideoResponse,
  GetHomeVideoByIdResponse,
  GetHomeVideosResponse,
  DeleteHomeVideoResponse,
} from "@/types/homevideosTypes";

const BASE = "/homepage";

export async function getHomeVideos(): Promise<GetHomeVideosResponse> {
  const response = await apiClient.get(`${BASE}`);
  const payload = response.data as any;
  if (Array.isArray(payload)) return payload as GetHomeVideosResponse;
  if (Array.isArray(payload?.data)) return payload.data as GetHomeVideosResponse;
  if (Array.isArray(payload?.items)) return payload.items as GetHomeVideosResponse;
  return [] as GetHomeVideosResponse;
}

export async function getHomeVideoById(id: string): Promise<GetHomeVideoByIdResponse> {
  const response = await apiClient.get(`${BASE}/${id}`);
  return (response.data as any) ?? null;
}

export async function createHomeVideo(payload: CreateHomeVideoPayload): Promise<CreateHomeVideoResponse> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("video", payload.video);

  const response = await apiClient.post(`${BASE}`, formData);
  return response.data as CreateHomeVideoResponse;
}

export async function updateHomeVideo(id: string, payload: UpdateHomeVideoPayload): Promise<UpdateHomeVideoResponse> {
  const formData = new FormData();
  if (typeof payload.title === "string") formData.append("title", payload.title);
  if (typeof payload.description === "string") formData.append("description", payload.description);
  if (payload.video) formData.append("video", payload.video);

  const response = await apiClient.put(`${BASE}/${id}`, formData);
  return response.data as UpdateHomeVideoResponse;
}

export async function deleteHomeVideo(id: string): Promise<DeleteHomeVideoResponse> {
  const response = await apiClient.delete(`${BASE}/${id}`);
  return response.data as DeleteHomeVideoResponse;
}
