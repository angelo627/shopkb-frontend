export type UserRole = "STAFF" | "ADMIN" | "SUPERADMIN";

export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "DISABLED";

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}
