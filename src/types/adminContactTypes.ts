// Admin Contact (Contact Us) Types

export interface AdminContactItem {
  _id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  resolved: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreateAdminContactPayload {
  name: string
  email: string
  phone: string
  subject?: string
  message: string
}

export interface UpdateAdminContactPayload {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  resolved?: boolean
}

export type GetAllAdminContactsResponse = Array<AdminContactItem>
export type GetAdminContactByIdResponse = AdminContactItem
export type CreateAdminContactResponse = AdminContactItem
export type UpdateAdminContactResponse = AdminContactItem

export interface DeleteAdminContactResponse {
  message: string
}


