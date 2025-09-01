import apiClient from "@/apiClient"
import {
  BlogCategory,
  BlogPost,
  CategoryCreateResponse,
  CreateBlogPayload,
  CreateCategoryPayload,
  GetAllBlogsResponse,
  GetAllCategoriesResponse,
  GetContentBlogsResponse,
  GetLatestBlogsResponse,
  GetLinkBlogsResponse,
  SimpleMessageResponse,
  SingleBlogResponse,
  UpdateBlogPayload,
  UpdateCategoryPayload,
} from "@/types/blogsTypes"

const BASE = "/blogs"

// Category Management
export async function createCategory(payload: CreateCategoryPayload) {
  try {
    const { data } = await apiClient.post<CategoryCreateResponse>(`${BASE}/categoryCreate`, payload)
    return data
  } catch (error: any) {
    console.error("Error creating category:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create category")
  }
}

export async function getAllCategories() {
  try {
    const { data } = await apiClient.get<GetAllCategoriesResponse>(`${BASE}/getallcategory`)
    return data
  } catch (error: any) {
    console.error("Error getting categories:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get categories")
  }
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload) {
  try {
    const { data } = await apiClient.put<CategoryCreateResponse>(`${BASE}/updatecategory/${id}`, payload)
    return data
  } catch (error: any) {
    console.error("Error updating category:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update category")
  }
}

export async function deleteCategory(id: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deletecategory/${id}`)
    return data
  } catch (error: any) {
    console.error("Error deleting category:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete category")
  }
}

// Blog Post Management
export async function createBlog(payload: CreateBlogPayload) {
  try {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("contentType", payload.contentType)
    formData.append("category", payload.category)
    formData.append("author", payload.author)
    formData.append("publishedDate", payload.publishedDate)
    formData.append("image", payload.image)
    
    if (payload.contents) {
      formData.append("contents", payload.contents)
    }
    
    if (payload.link) {
      formData.append("link", payload.link)
    }

    const { data } = await apiClient.post<BlogPost>(`${BASE}/createblog`, formData)
    return data
  } catch (error: any) {
    console.error("Error creating blog:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create blog")
  }
}

export async function getAllBlogs() {
  try {
    const { data } = await apiClient.get<GetAllBlogsResponse>(`${BASE}/getallblogs`)
    return data
  } catch (error: any) {
    console.error("Error getting all blogs:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get all blogs")
  }
}

export async function getContentBlogs() {
  try {
    const { data } = await apiClient.get<GetContentBlogsResponse>(`${BASE}/contentblogs/posts`)
    return data
  } catch (error: any) {
    console.error("Error getting content blogs:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get content blogs")
  }
}

export async function getLinkBlogs() {
  try {
    const { data } = await apiClient.get<GetLinkBlogsResponse>(`${BASE}/linkblogs/posts`)
    return data
  } catch (error: any) {
    console.error("Error getting link blogs:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get link blogs")
  }
}

export async function getLatestBlogs() {
  try {
    const { data } = await apiClient.get<GetLatestBlogsResponse>(`${BASE}/getlatest`)
    return data
  } catch (error: any) {
    console.error("Error getting latest blogs:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get latest blogs")
  }
}

export async function getSingleBlog(id: string) {
  try {
    const { data } = await apiClient.get<SingleBlogResponse>(`${BASE}/singleblog/${id}`)
    return data
  } catch (error: any) {
    console.error("Error getting single blog:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get single blog")
  }
}

export async function updateBlog(id: string, payload: UpdateBlogPayload) {
  try {
    const formData = new FormData()
    
    if (payload.title) formData.append("title", payload.title)
    if (payload.contentType) formData.append("contentType", payload.contentType)
    if (payload.category) formData.append("category", payload.category)
    if (payload.author) formData.append("author", payload.author)
    if (payload.publishedDate) formData.append("publishedDate", payload.publishedDate)
    if (payload.contents) formData.append("contents", payload.contents)
    if (payload.link) formData.append("link", payload.link)
    if (payload.image) formData.append("image", payload.image)

    const { data } = await apiClient.put<BlogPost>(`${BASE}/updateblogs/${id}`, formData)
    return data
  } catch (error: any) {
    console.error("Error updating blog:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update blog")
  }
}

export async function deleteBlog(id: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteblog/${id}`)
    return data
  } catch (error: any) {
    console.error("Error deleting blog:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete blog")
  }
}
