export type Role = 'USER' | 'AUTHOR' | 'MODERATOR' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
}

export interface UserProfile extends User {
  avatarUrl: string | null;
  bio: string | null;
  title: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
