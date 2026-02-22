import apiClient from "@/apiClient"
import type {
  CuratedCategory,
  CreateCuratedCategoryPayload,
  UpdateCuratedCategoryPayload,
  CuratedImagesByCategoryResponse,
  CuratedImage,
  UpdateCuratedImagePayload,
  CuratedGroupedItem,
  CuratedSectionResponse,
} from "@/types/curatedTypes"

const BASE = "/curated"

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: { message?: string } }; message?: string }
  return err?.response?.data?.message || err?.message || fallback
}

// Categories (API returns { categories: [...] }; we return array for callers)
export async function getCategories(publicOnly?: boolean): Promise<CuratedCategory[]> {
  try {
    const params = publicOnly ? { public: "true" } : undefined
    const { data } = await apiClient.get<{ categories: CuratedCategory[] }>(`${BASE}/categories`, { params })
    return data.categories ?? []
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch categories"))
  }
}

export async function createCategory(payload: CreateCuratedCategoryPayload): Promise<CuratedCategory> {
  try {
    const { data } = await apiClient.post<CuratedCategory>(`${BASE}/category`, payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create category"))
  }
}

export async function updateCategory(
  id: string,
  payload: UpdateCuratedCategoryPayload
): Promise<CuratedCategory> {
  try {
    const { data } = await apiClient.put<CuratedCategory>(`${BASE}/category/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update category"))
  }
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.delete<{ message: string }>(`${BASE}/category/${id}`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete category"))
  }
}

// Images
export async function getImagesByCategory(
  categoryId: string
): Promise<CuratedImagesByCategoryResponse> {
  try {
    const { data } = await apiClient.get<CuratedImagesByCategoryResponse>(`${BASE}/images`, {
      params: { categoryId },
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch images"))
  }
}

export async function uploadImage(formData: FormData): Promise<CuratedImage> {
  try {
    const { data } = await apiClient.post<CuratedImage>(`${BASE}/image`, formData)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to upload image"))
  }
}

export async function updateImage(
  id: string,
  payload: UpdateCuratedImagePayload | FormData
): Promise<CuratedImage> {
  try {
    const { data } = await apiClient.put<CuratedImage>(`${BASE}/image/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update image"))
  }
}

export async function deleteImage(id: string): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.delete<{ message: string }>(`${BASE}/image/${id}`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete image"))
  }
}

// Public: all images grouped by category (for carousel on home) (API returns { grouped: [...] })
export async function getGroupedImages(): Promise<CuratedGroupedItem[]> {
  try {
    const { data } = await apiClient.get<{ grouped: CuratedGroupedItem[] }>(`${BASE}/images/grouped`)
    return data.grouped ?? []
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch grouped images"))
  }
}

// Public: section by slug (short-film | documentary-film | jury)
export async function getSectionBySlug(slug: string): Promise<CuratedSectionResponse> {
  try {
    const { data } = await apiClient.get<CuratedSectionResponse>(`${BASE}/sections/${slug}`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch section"))
  }
}
