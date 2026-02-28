// Keep names as you shared, but include `contacted` (exists in your model).
// createdAt/updatedAt are optional unless you enable Mongoose {timestamps:true}.

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  contacted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ContactUpdateResponse extends Contact {}
export interface ContactCreateResponse extends Contact {}
export interface ContactDeleteResponse extends Contact {}
