export interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "editor"
  password?: string
  __v?: number
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: "admin" | "editor"
}

export interface EditUserData {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  role: "admin" | "editor"
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
