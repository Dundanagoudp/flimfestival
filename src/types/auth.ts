export type LoginRequest = {
  email: string;
  password: string;
  captchaId: string;
  captchaCode: string;
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