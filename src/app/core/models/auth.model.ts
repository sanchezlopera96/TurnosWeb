export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface ClientLoginRequest {
  idNumber: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  identifier: string;
  expiresAt: Date;
}

export interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}