export type LoginRequest = {
  email: string;
  password: string;
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