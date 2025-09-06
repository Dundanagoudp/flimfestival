import apiClient from "@/apiClient";
import {
  CreateWorkshopPayload,
  CreateWorkshopResponse,
  UpdateWorkshopPayload,
  UpdateWorkshopResponse,
  DeleteWorkshopResponse,
  GetWorkshopsResponse,
  Workshop,
  SimpleMessageResponse,
} from "@/types/workshop-Types";

const BASE = "/workshop";

// Get all workshops
export async function getWorkshops(): Promise<GetWorkshopsResponse> {
  try {
    const { data } = await apiClient.get<GetWorkshopsResponse>(`${BASE}/getWorkshop`);
    return data;
  } catch (error: any) {
    console.error("Error fetching workshops:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get workshops"
    );
  }
}

// Get workshop by ID
export async function getWorkshopById(workshopId: string): Promise<Workshop | null> {
  try {
    const workshops = await getWorkshops();
    return workshops.find((w) => w._id === workshopId) || null;
  } catch (error: any) {
    console.error("Error fetching workshop by ID:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get workshop"
    );
  }
}

// Create workshop (supports multipart with image)
export async function addWorkshop(
  eventId: string,
  payload: CreateWorkshopPayload
): Promise<CreateWorkshopResponse> {
  try {
    const hasFile = Boolean(payload.imageFile);
    
    if (hasFile) {
      const form = new FormData();
      form.append("name", payload.name);
      form.append("about", payload.about);
      form.append("registrationFormUrl", payload.registrationFormUrl);
      if (payload.imageFile) form.append("imageUrl", payload.imageFile);
      
      const { data } = await apiClient.post<CreateWorkshopResponse>(
        `${BASE}/addWorkshop/${eventId}`,
        form
      );
      return data;
    }
    
    // If no file, send as JSON
    const { imageFile, ...jsonPayload } = payload;
    const { data } = await apiClient.post<CreateWorkshopResponse>(
      `${BASE}/addWorkshop/${eventId}`,
      jsonPayload
    );
    return data;
  } catch (error: any) {
    console.error("Error creating workshop:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to create workshop"
    );
  }
}

// Update workshop (supports multipart with image)
export async function updateWorkshop(
  workshopId: string,
  payload: UpdateWorkshopPayload
): Promise<UpdateWorkshopResponse> {
  try {
    const hasFile = Boolean(payload.imageFile);
    
    if (hasFile) {
      const form = new FormData();
      if (payload.name !== undefined) form.append("name", payload.name);
      if (payload.about !== undefined) form.append("about", payload.about);
      if (payload.registrationFormUrl !== undefined) 
        form.append("registrationFormUrl", payload.registrationFormUrl);
      if (payload.imageFile) form.append("imageUrl", payload.imageFile);
      
      const { data } = await apiClient.put<UpdateWorkshopResponse>(
        `${BASE}/updateWorkshop/${workshopId}`,
        form
      );
      return data;
    }
    
    // If no file, send as JSON
    const { imageFile, ...jsonPayload } = payload;
    const { data } = await apiClient.put<UpdateWorkshopResponse>(
      `${BASE}/updateWorkshop/${workshopId}`,
      jsonPayload
    );
    return data;
  } catch (error: any) {
    console.error("Error updating workshop:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to update workshop"
    );
  }
}

// Delete workshop
export async function deleteWorkshop(workshopId: string): Promise<DeleteWorkshopResponse> {
  try {
    const { data } = await apiClient.delete<DeleteWorkshopResponse>(
      `${BASE}/deleteWorkshop/${workshopId}`
    );
    return data;
  } catch (error: any) {
    console.error("Error deleting workshop:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to delete workshop"
    );
  }
}

// Get workshops by event ID
export async function getWorkshopsByEvent(eventId: string): Promise<Workshop[]> {
  try {
    const workshops = await getWorkshops();
    return workshops.filter((w) => w.eventRef === eventId);
  } catch (error: any) {
    console.error("Error fetching workshops by event:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get workshops by event"
    );
  }
}

// Get total workshops count
export async function getTotalWorkshops(): Promise<number> {
  try {
    const workshops = await getWorkshops();
    return workshops.length;
  } catch (error: any) {
    console.error("Error fetching total workshops:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get total workshops"
    );
  }
}