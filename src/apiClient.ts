import axios from "axios"
import Cookies from "js-cookie"
import { getAuthToken } from "@/utils/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL. Please set it in .env.local")
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  timeout: 45000,
})

// Add request interceptors for authentication tokens
apiClient.interceptors.request.use(
  (config) => {
    // Prefer our helper which tries multiple cookie names
    let token = getAuthToken()

    // Fallback to js-cookie direct read
    if (!token) token = Cookies.get("token") || null

    // Final fallback: localStorage (in case cookies were blocked/cleared)
    if (!token && typeof window !== "undefined") {
      try {
        token = window.localStorage.getItem("token")
      } catch {}
    }

    if (token) config.headers.Authorization = `Bearer ${token}`

    // Let the browser set the proper multipart boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    return config
  },
  (error) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Request interceptor error:", error?.message)
    }
    return Promise.reject(error)
  },
)

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        code: error.code,
      })
    }

    if (error.code === "ECONNABORTED" && process.env.NODE_ENV !== "production") {
      console.error("Request timeout - the server took too long to respond")
    }

    return Promise.reject(error)
  },
)

export default apiClient