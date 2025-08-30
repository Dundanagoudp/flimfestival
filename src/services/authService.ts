import { LoginRequest, LoginResponse, LogoutResponse } from "@/types/auth";
import apiClient from "../apiClient";

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post("/auth/login", data, {
    withCredentials: true,
  });
  return response.data;
} 

export async function logoutUser(): Promise<LogoutResponse> {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}
