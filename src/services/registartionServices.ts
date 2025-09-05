import apiClient from "@/apiClient";
import {
  RegistrationData,
  RegistrationItem,
  RegistrationResponse,
  GetAllRegistrationsResponse,
  UpdateRegistrationPayload,
} from "@/types/registartionTypes";

const BASE = "/registration";

// Get all registrations
export async function getAllRegistrations(page: number = 1, limit: number = 10) {
  try {
    const { data } = await apiClient.get<RegistrationItem[]>(`${BASE}/getAllRegistration`, {
      params: { page, limit },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching registrations:", error);
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get registrations");
  }
}

// Get registration by ID
export async function getRegistrationById(id: string) {
  try {
    const { data } = await apiClient.get<RegistrationItem>(`${BASE}/getRegistrationById/${id}`);
    return data;
  } catch (error: any) {
    console.error("Error fetching registration:", error);
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get registration");
  }
}

// Create new registration
export async function createRegistration(registrationData: RegistrationData) {
  try {
    const { data } = await apiClient.post<RegistrationResponse>(`${BASE}/createRegistration`, registrationData);
    return data;
  } catch (error: any) {
    console.error("Error creating registration:", error);
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create registration");
  }
}

// Update registration by ID
export async function updateRegistrationById(id: string, payload: UpdateRegistrationPayload) {
  try {
    const { data } = await apiClient.put<RegistrationItem>(`${BASE}/updateRegistrationById/${id}`, payload);
    return data;
  } catch (error: any) {
    console.error("Error updating registration:", error);
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update registration");
  }
}

// Delete registration by ID
export async function deleteRegistrationById(id: string) {
  try {
    const { data } = await apiClient.delete<{ message: string }>(`${BASE}/deleteRegistartionById/${id}`);
    return data;
  } catch (error: any) {
    
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete registration");
  }
}

// Mark registration as contacted
export async function markAsContacted(id: string) {
  try {
    const { data } = await apiClient.put<RegistrationItem>(`${BASE}/updateRegistrationById/${id}`, {
      contacted: true,
    });
    return data;
  } catch (error: any) {
    console.error("Error marking registration as contacted:", error);
    throw new Error(error?.response?.data?.message || error?.message || "Failed to mark as contacted");
  }
}

// Mark registration as not contacted
export async function markAsNotContacted(id: string) {
  try {
    const { data } = await apiClient.put<RegistrationItem>(`${BASE}/updateRegistrationById/${id}`, {
      contacted: false,
    });
    return data;
  } catch (error: any) {
    console.error("Error marking registration as not contacted:", error);
    throw new Error(error?.response?.data?.message || error?.message || "Failed to mark as not contacted");
  }
}
