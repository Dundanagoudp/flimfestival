import type { ApiResponse, User, CreateUserData, EditUserData } from "@/types/user-types"
import apiClient from "../apiClient"
import { encryptPayload, isEncryptionAvailable } from "@/lib/encryption"

// Get all Users
export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  try {
    const response = await apiClient.get("/auth/getUsers")
    return {
      success: true,
      data: response.data,
      message: "Users fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch users",
    }
  }
}

// Add User
export async function addUser(data: CreateUserData): Promise<ApiResponse<User>> {
  try {
    const body = isEncryptionAvailable()
      ? { encryptedBody: encryptPayload(data) }
      : data
    const response = await apiClient.post("/auth/addUser", body)
    return {
      success: true,
      data: response.data,
      message: "User added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add user",
    }
  }
}

// Delete User
export async function deleteUser(userId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/auth/deleteUser/${userId}`)
    return {
      success: true,
      data: response.data,
      message: "User deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete user",
    }
  }
}

// Edit User
export async function editUser(userId: string, data: EditUserData): Promise<ApiResponse<User>> {
  try {
    const body = isEncryptionAvailable()
      ? { encryptedBody: encryptPayload(data) }
      : data
    const response = await apiClient.put(`/auth/editUser/${userId}`, body)
    return {
      success: true,
      data: response.data.user,
      message: "User updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to edit user",
    }
  }
}

// Get current user profile
export async function getMyProfile(): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.get("/auth/getMyProfile")
    return {
      success: true,
      data: response.data.user,
      message: "Profile fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch profile",
    }
  }
}

// logout user
export async function logoutUser(): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post("/auth/logout")
    return {
      success: true,
      data: response.data,
      message: "User logged out successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to logout user",
    }
  }
}