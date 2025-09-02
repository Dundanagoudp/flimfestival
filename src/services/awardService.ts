import apiClient from "@/apiClient"
import {
  Award,
  AwardCreateResponse,
  AwardDeleteResponse,
  AwardUpdateResponse,
  CreateAwardPayload,
  GetAllAwardsResponse,
  GetAwardByIdResponse,
  SimpleMessageResponse,
  UpdateAwardPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryCreateResponse,
  GetAllCategoriesResponse,
} from "@/types/awardTypes"

const BASE = "/awards"

// Category Management
export async function createAwardCategory(payload: CreateCategoryPayload): Promise<CategoryCreateResponse> {
  try {
    const { data } = await apiClient.post<CategoryCreateResponse>(`${BASE}/categoryCreate`, payload)
    return data
  } catch (error: any) {
    console.error("Error creating award category:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to create award category"
    throw new Error(errorMessage)
  }
}

export async function getAllAwardCategories(): Promise<GetAllCategoriesResponse> {
  try {
    const { data } = await apiClient.get<GetAllCategoriesResponse>(`${BASE}/getAllCategories`)
    return data
  } catch (error: any) {
    console.error("Error getting all award categories:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to get award categories"
    throw new Error(errorMessage)
  }
}

export async function updateAwardCategory(id: string, payload: UpdateCategoryPayload): Promise<CategoryCreateResponse> {
  try {
    if (!id || id.trim() === "") {
      throw new Error("Category ID is required")
    }
    
    const { data } = await apiClient.put<CategoryCreateResponse>(`${BASE}/updateCategory/${id}`, payload)
    return data
  } catch (error: any) {
    console.error("Error updating award category:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to update award category"
    throw new Error(errorMessage)
  }
}

export async function deleteAwardCategory(id: string): Promise<SimpleMessageResponse> {
  try {
    if (!id || id.trim() === "") {
      throw new Error("Category ID is required")
    }
    
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteCategory/${id}`)
    return data
  } catch (error: any) {
    console.error("Error deleting award category:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete award category"
    throw new Error(errorMessage)
  }
}

// Create Award
export async function createAward(payload: CreateAwardPayload): Promise<AwardCreateResponse> {
  try {
    const formData = new FormData()
    
    // Required fields
    formData.append("title", payload.title)
    formData.append("description", payload.description)
    formData.append("rule1", payload.rule1)
    formData.append("rule2", payload.rule2)
    formData.append("rule3", payload.rule3)
    formData.append("category", payload.category)
    
    // Handle main image
    if (payload.image) {
      formData.append("image", payload.image)
    }
    
    // Handle array of images
    if (payload.array_images && payload.array_images.length > 0) {
      payload.array_images.forEach((file) => {
        formData.append("array_images", file)
      })
    }

    const { data } = await apiClient.post<AwardCreateResponse>(`${BASE}/createAwards`, formData)
    return data
  } catch (error: any) {
    console.error("Error creating award:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to create award"
    throw new Error(errorMessage)
  }
}

// Get All Awards
export async function getAllAwards(): Promise<GetAllAwardsResponse> {
  try {
    const { data } = await apiClient.get<GetAllAwardsResponse>(`${BASE}/getAllAwards`)
    return data
  } catch (error: any) {
    console.error("Error getting all awards:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to get all awards"
    throw new Error(errorMessage)
  }
}

// Get Award By ID
export async function getAwardById(id: string): Promise<GetAwardByIdResponse> {
  try {
    if (!id || id.trim() === "") {
      throw new Error("Award ID is required")
    }
    
    const { data } = await apiClient.get<GetAwardByIdResponse>(`${BASE}/getAwardsById/${id}`)
    return data
  } catch (error: any) {
    console.error("Error getting award by ID:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to get award by ID"
    throw new Error(errorMessage)
  }
}

// Update Award
export async function updateAward(id: string, payload: UpdateAwardPayload): Promise<AwardUpdateResponse> {
  try {
    if (!id || id.trim() === "") {
      throw new Error("Award ID is required")
    }
    
    const formData = new FormData()
    
    // Only append fields that are provided
    if (payload.title !== undefined) formData.append("title", payload.title)
    if (payload.description !== undefined) formData.append("description", payload.description)
    if (payload.rule1 !== undefined) formData.append("rule1", payload.rule1)
    if (payload.rule2 !== undefined) formData.append("rule2", payload.rule2)
    if (payload.rule3 !== undefined) formData.append("rule3", payload.rule3)
    if (payload.category !== undefined) formData.append("category", payload.category)
    
    // Handle main image if provided
    if (payload.image) {
      formData.append("image", payload.image)
    }
    
    // Handle array of images if provided
    if (payload.array_images && payload.array_images.length > 0) {
      payload.array_images.forEach((file) => {
        formData.append("array_images", file)
      })
    }

    const { data } = await apiClient.put<AwardUpdateResponse>(`${BASE}/updateAwards/${id}`, formData)
    return data
  } catch (error: any) {
    console.error("Error updating award:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to update award"
    throw new Error(errorMessage)
  }
}

// Delete Award
export async function deleteAward(id: string): Promise<AwardDeleteResponse> {
  try {
    if (!id || id.trim() === "") {
      throw new Error("Award ID is required")
    }
    
    const { data } = await apiClient.delete<AwardDeleteResponse>(`${BASE}/deleteAwards/${id}`)
    return data
  } catch (error: any) {
    console.error("Error deleting award:", error)
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete award"
    throw new Error(errorMessage)
  }
}

// Helper function to validate award data
export function validateAwardData(payload: CreateAwardPayload): string[] {
  const errors: string[] = []
  
  if (!payload.title || payload.title.trim() === "") {
    errors.push("Title is required")
  }
  
  if (!payload.description || payload.description.trim() === "") {
    errors.push("Description is required")
  }
  
  if (!payload.category || payload.category.trim() === "") {
    errors.push("Category is required")
  }
  
  if (!payload.image) {
    errors.push("Main image is required")
  }
  
  if (!payload.rule1 || payload.rule1.trim() === "") {
    errors.push("Rule 1 is required")
  }
  
  if (!payload.rule2 || payload.rule2.trim() === "") {
    errors.push("Rule 2 is required")
  }
  
  if (!payload.rule3 || payload.rule3.trim() === "") {
    errors.push("Rule 3 is required")
  }
  
  if (!payload.array_images || payload.array_images.length === 0) {
    errors.push("At least one additional image is required")
  }
  
  return errors
}

// Helper function to prepare update payload (remove undefined values)
export function prepareUpdatePayload(payload: UpdateAwardPayload): Partial<UpdateAwardPayload> {
  const cleanPayload: Partial<UpdateAwardPayload> = {}
  
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleanPayload[key as keyof UpdateAwardPayload] = value
    }
  })
  
  return cleanPayload
}
