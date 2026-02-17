export type LoginRequest = {
  email: string;
  password: string;
  /** ALTCHA payload (sent as `altcha` in request body) */
  altchaPayload?: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  data: {
    user: {
      role: string;
      accountType?: string;
    };
  };
}; 

export type LogoutResponse = {
  message: string;
  success: boolean;
};