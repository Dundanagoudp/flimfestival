import { LoginRequest, LoginResponse, LogoutResponse } from "@/types/auth";
import apiClient from "../apiClient";

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post("/onboarding/login", data, {
    withCredentials: true,
  });
  return response.data;
} 

export async function logoutUser(data:LogoutResponse): Promise<void> {
  await apiClient.post("/onboarding/logout");
}
