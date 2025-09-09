import apiClient from "@/apiClient"
import type {
  AdminContactItem,
  CreateAdminContactPayload,
  UpdateAdminContactPayload,
  GetAllAdminContactsResponse,
  GetAdminContactByIdResponse,
  CreateAdminContactResponse,
  UpdateAdminContactResponse,
  DeleteAdminContactResponse,
} from "@/types/adminContactTypes"

const BASE = "/contactus"

const routes = {
  create: `${BASE}/createContactUs`,
  all: `${BASE}/getAllContactUs`,
  one: (id: string) => `${BASE}/getContactUsById/${encodeURIComponent(id)}`,
  update: (id: string) => `${BASE}/updateContactUsById/${encodeURIComponent(id)}`,
  delete: (id: string) => `${BASE}/deleteContactUsById/${encodeURIComponent(id)}`,
}

export async function createContact(payload: CreateAdminContactPayload): Promise<CreateAdminContactResponse> {
  const { data } = await apiClient.post<CreateAdminContactResponse>(routes.create, payload)
  return data
}

export async function getAllContacts(): Promise<GetAllAdminContactsResponse> {
  const { data } = await apiClient.get<GetAllAdminContactsResponse>(routes.all)
  return data
}

export async function getContactById(id: string): Promise<GetAdminContactByIdResponse> {
  const { data } = await apiClient.get<GetAdminContactByIdResponse>(routes.one(id))
  return data
}

export async function updateContactById(id: string, payload: UpdateAdminContactPayload): Promise<UpdateAdminContactResponse> {
  const { data } = await apiClient.put<UpdateAdminContactResponse>(routes.update(id), payload)
  return data
}

export async function deleteContactById(id: string): Promise<DeleteAdminContactResponse> {
  const { data } = await apiClient.delete<DeleteAdminContactResponse>(routes.delete(id))
  return data
}

export const AdminContactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactById,
  deleteContactById,
}

export default AdminContactService


