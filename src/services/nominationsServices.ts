import apiClient from "@/apiClient";
import {
  CreateNominationPayload,
  CreateNominationResponse,
  UpdateNominationPayload,
  UpdateNominationResponse,
  DeleteNominationResponse,
  GetNominationsResponse,
  GetNominationByIdResponse,
} from "@/types/nominationsTypes";

const BASE = "/nominations";

export async function getNominations(): Promise<GetNominationsResponse> {
  const response = await apiClient.get(`${BASE}`);
  const payload = response.data as any;
  if (Array.isArray(payload)) return payload as GetNominationsResponse;
  if (Array.isArray(payload?.data)) return payload.data as GetNominationsResponse;
  if (Array.isArray(payload?.items)) return payload.items as GetNominationsResponse;
  if (Array.isArray(payload?.nominations)) return payload.nominations as GetNominationsResponse;
  return [] as GetNominationsResponse;
}

export async function getNominationById(id: string): Promise<GetNominationByIdResponse> {
  const { data } = await apiClient.get<GetNominationByIdResponse>(`${BASE}/${id}`);
  return data;
}

export async function createNomination(
  payload: CreateNominationPayload
): Promise<CreateNominationResponse> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("type", payload.type);
  if (payload.imageFile) form.append("image", payload.imageFile);
  const { data } = await apiClient.post<CreateNominationResponse>(`${BASE}`, form);
  return data;
}

export async function updateNomination(
  id: string,
  payload: UpdateNominationPayload
): Promise<UpdateNominationResponse> {
  const form = new FormData();
  if (payload.title !== undefined) form.append("title", payload.title);
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.type !== undefined) form.append("type", payload.type);
  if (payload.imageFile) form.append("image", payload.imageFile);
  const { data } = await apiClient.put<UpdateNominationResponse>(`${BASE}/${id}`, form);
  return data;
}

export async function deleteNomination(id: string): Promise<DeleteNominationResponse> {
  const { data } = await apiClient.delete<DeleteNominationResponse>(`${BASE}/${id}`);
  return data;
}


