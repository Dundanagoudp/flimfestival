import { LoginRequest, LoginResponse, LogoutResponse } from "@/types/auth";
import apiClient from "../apiClient";
import { encryptPayload, isEncryptionAvailable } from "@/lib/encryption";

/** GET /captcha/generate - returns challenge data for ALTCHA widget */
export async function generateCaptcha() {
  const response = await apiClient.get("/captcha/generate");
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const body = {
    email: data.email,
    password: data.password,
    ...(data.altchaPayload && { altcha: data.altchaPayload }),
  };
  const useEncryption = isEncryptionAvailable();
  const requestBody = useEncryption
    ? { encryptedBody: encryptPayload(body) }
    : body;
  if (process.env.NODE_ENV === "development" && useEncryption) {
    console.log("[auth] Login request encrypted with AES-256-CBC");
  }
  const response = await apiClient.post("/auth/login", requestBody, {
    withCredentials: true,
  });
  return response.data;
} 

export async function logoutUser(): Promise<LogoutResponse> {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}
