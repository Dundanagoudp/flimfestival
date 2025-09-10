// src/services/ContactService.ts
import apiClient from "@/apiClient"; 
import type {
  Contact,
  ContactForm,
  ContactCreateResponse,
  ContactUpdateResponse,
  ContactDeleteResponse,
} from "@/types/contactTypes";

// NOTE: routes match what you shared (including the misspelling in DELETE)
const routes = {
  create: "contactus/createContactUs",
  all: "contactus/getAllContactUs",
  one: (id: string) => `contactus/getContactUsById/${encodeURIComponent(id)}`,
  update: (id: string) => `contactus/updateContactUsById/${encodeURIComponent(id)}`,
  delete: (id: string) => `contactus/deleteContactUsById/${encodeURIComponent(id)}`, // <-- as in your router
};

 async function createRegistration(
  payload: ContactForm
): Promise<ContactCreateResponse> {
  const { data } = await apiClient.post<ContactCreateResponse>(routes.create, payload);
  return data;
}

async function getAllRegistrations(): Promise<Contact[]> {
  const { data } = await apiClient.get<Contact[]>(routes.all);
  return data;
}

async function getRegistrationById(id: string): Promise<Contact> {
  const { data } = await apiClient.get<Contact>(routes.one(id));
  return data;
}

async function updateRegistrationById(
  id: string,
  payload: Partial<Contact>
): Promise<ContactUpdateResponse> {
  const { data } = await apiClient.put<ContactUpdateResponse>(routes.update(id), payload);
  return data;
}

async function deleteRegistrationById(id: string): Promise<ContactDeleteResponse> {
  const { data } = await apiClient.delete<ContactDeleteResponse>(routes.delete(id));
  return data;
}

/** Convenience helper to flip the `contacted` flag (admin-protected route) */
async function markRegistrationContacted(
  id: string,
  contacted = true
): Promise<ContactUpdateResponse> {
  return updateRegistrationById(id, { contacted });
}

export const ContactService = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationById,
  deleteRegistrationById,
  markRegistrationContacted,
};

export default ContactService;
