import apiClient from "@/apiClient";
import {
  CreateWorkshopPayload,
  CreateWorkshopResponse,
  UpdateWorkshopPayload,
  UpdateWorkshopResponse,
  DeleteWorkshopResponse,
  Workshop,
  WorkshopCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  GroupedWorkshopsResponse,
} from "@/types/workshop-Types";

const BASE = "/workshop";

// --- Categories ---
export async function getCategories(): Promise<WorkshopCategory[]> {
  try {
    const { data } = await apiClient.get<WorkshopCategory[]>(`${BASE}/getCategories`);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get categories"
    );
  }
}

export async function addCategory(payload: CreateCategoryPayload): Promise<{ message: string; category?: WorkshopCategory }> {
  try {
    const { data } = await apiClient.post(`${BASE}/addCategory`, payload);
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to create category"
    );
  }
}

export async function updateCategory(
  categoryId: string,
  payload: UpdateCategoryPayload
): Promise<{ message: string; category?: WorkshopCategory }> {
  try {
    const { data } = await apiClient.put(`${BASE}/updateCategory/${categoryId}`, payload);
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to update category"
    );
  }
}

export async function deleteCategory(categoryId: string): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.delete<{ message: string }>(
      `${BASE}/deleteCategory/${categoryId}`
    );
    return data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || error?.message || "Failed to delete category";
    throw new Error(msg);
  }
}

// --- Workshops ---
export interface GetWorkshopsOptions {
  groupByCategory?: boolean;
  categoryId?: string;
}

/** Flat list of workshops */
export async function getWorkshops(
  options?: GetWorkshopsOptions
): Promise<Workshop[] | GroupedWorkshopsResponse> {
  try {
    const params = new URLSearchParams();
    if (options?.groupByCategory) params.set("groupByCategory", "true");
    if (options?.categoryId) params.set("categoryId", options.categoryId);
    const query = params.toString();
    const url = query ? `${BASE}/getWorkshop?${query}` : `${BASE}/getWorkshop`;
    const { data } = await apiClient.get<Workshop[] | GroupedWorkshopsResponse>(url);
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get workshops"
    );
  }
}

/** Flat workshops only (for admin table, etc.) */
export async function getWorkshopsFlat(): Promise<Workshop[]> {
  const result = await getWorkshops();
  return Array.isArray(result) && result.length > 0 && "category" in result[0]
    ? (result as GroupedWorkshopsResponse).flatMap((g) => g.workshops)
    : (result as Workshop[]);
}

/** Grouped by category (for public workshop page) */
export async function getWorkshopsGrouped(): Promise<GroupedWorkshopsResponse> {
  const result = await getWorkshops({ groupByCategory: true });
  if (!Array.isArray(result)) return [];
  if (result.length === 0) return [];
  const first = result[0] as GroupedWorkshopsResponse[0] | Workshop;
  if ("category" in first && "workshops" in first)
    return result as GroupedWorkshopsResponse;
  return [
    {
      category: { _id: null, name: "Uncategorized", order: 999 },
      workshops: result as Workshop[],
    },
  ];
}

// Get workshop by ID (uses flat list)
export async function getWorkshopById(workshopId: string): Promise<Workshop | null> {
  try {
    const workshops = await getWorkshopsFlat();
    return workshops.find((w) => w._id === workshopId) || null;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get workshop"
    );
  }
}

// Create workshop (no eventId; supports multipart with image and optional categoryId)
export async function addWorkshop(payload: CreateWorkshopPayload): Promise<CreateWorkshopResponse> {
  try {
    const hasFile = Boolean(payload.imageFile);

    if (hasFile) {
      const form = new FormData();
      form.append("name", payload.name);
      form.append("about", payload.about);
      form.append("registrationFormUrl", payload.registrationFormUrl);
      if (payload.imageFile) form.append("imageUrl", payload.imageFile);
      if (payload.categoryId) form.append("categoryId", payload.categoryId);

      const { data } = await apiClient.post<CreateWorkshopResponse>(
        `${BASE}/addWorkshop`,
        form
      );
      return data;
    }

    const { imageFile, categoryId, ...rest } = payload;
    const body = categoryId ? { ...rest, categoryId } : rest;
    const { data } = await apiClient.post<CreateWorkshopResponse>(
      `${BASE}/addWorkshop`,
      body
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to create workshop"
    );
  }
}

// Update workshop (supports multipart with image and optional categoryId)
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
      if (payload.categoryId !== undefined && payload.categoryId !== null)
        form.append("categoryId", String(payload.categoryId));

      const { data } = await apiClient.put<UpdateWorkshopResponse>(
        `${BASE}/updateWorkshop/${workshopId}`,
        form
      );
      return data;
    }

    const { imageFile, ...jsonPayload } = payload;
    const { data } = await apiClient.put<UpdateWorkshopResponse>(
      `${BASE}/updateWorkshop/${workshopId}`,
      jsonPayload
    );
    return data;
  } catch (error: any) {
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
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to delete workshop"
    );
  }
}

// Get total workshops count
export async function getTotalWorkshops(): Promise<number> {
  try {
    const workshops = await getWorkshopsFlat();
    return workshops.length;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to get total workshops"
    );
  }
}