export type LoginRequest = {
  email: string;
  password: string;
  /** ALTCHA payload (sent as `altcha` in request body) */
  altchaPayload?: string;
};

/** Login returns only success and message; JWT is in HttpOnly cookie. */
export type LoginResponse = {
  success: boolean;
  message: string;
}; 

export type LogoutResponse = {
  message: string;
  success: boolean;
};