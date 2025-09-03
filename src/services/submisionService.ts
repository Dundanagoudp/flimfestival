// src/services/submissionService.ts
import apiClient from "@/apiClient";
import type {
  Submission,
  CreateSubmissionPayload,
  UpdateSubmissionPayload,
  SubmissionCreateResponse,
  GetAllSubmissionsResponse,
  GetSubmissionByIdResponse,
  SubmissionUpdateResponse,
  SubmissionDeleteResponse,
} from "@/types/submission";

const BASE = "/submission";

const routes = {
  create: `${BASE}/createSubmission`,
  all: `${BASE}/getAllSubmission`,
  one: (id: string) => `${BASE}/getSubmissionById/${encodeURIComponent(id)}`,
  update: (id: string) => `${BASE}/updateSubmissionById/${encodeURIComponent(id)}`,
  delete: (id: string) => `${BASE}/deleteSubmissionById/${encodeURIComponent(id)}`,
};
export async function createSubmission(
  payload: CreateSubmissionPayload
): Promise<SubmissionCreateResponse> {
  const fd = new FormData();
  fd.append("fullName", payload.fullName);
  fd.append("email", payload.email);
  fd.append("phone", payload.phone);
  fd.append("videoType", payload.videoType);
  fd.append("videoFile", payload.videoFile); // field name must match router: upload.single("videoFile")
  fd.append("message", payload.message);

  const { data } = await apiClient.post<SubmissionCreateResponse>(routes.create, fd);
  return data;
}

/** Get all submissions. */
export async function getAllSubmissions(): Promise<GetAllSubmissionsResponse> {
  const { data } = await apiClient.get<GetAllSubmissionsResponse>(routes.all);
  return data;
}

/** Get a single submission by id. */
export async function getSubmissionById(id: string): Promise<GetSubmissionByIdResponse> {
  const { data } = await apiClient.get<GetSubmissionByIdResponse>(routes.one(id));
  return data;
}

export async function updateSubmissionById(
  id: string,
  payload: UpdateSubmissionPayload
): Promise<SubmissionUpdateResponse> {
  const { data } = await apiClient.put<SubmissionUpdateResponse>(routes.update(id), payload);
  return data;
}

/** Delete a submission by id. (admin-protected) */
export async function deleteSubmissionById(id: string): Promise<SubmissionDeleteResponse> {
  const { data } = await apiClient.delete<SubmissionDeleteResponse>(routes.delete(id));
  return data;
}

/** Convenience helper: mark as contacted (admin-protected). */
export async function markSubmissionContacted(
  id: string,
  contacted = true
): Promise<SubmissionUpdateResponse> {
  return updateSubmissionById(id, { contacted });
}

const SubmissionService = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionById,
  deleteSubmissionById,
  markSubmissionContacted,
};

export default SubmissionService;
