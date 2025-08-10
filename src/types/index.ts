export interface ApiResponse<T = any> {
  content: T;
  message: string;
  errors: string[];
}

export interface Todo {
  id: string;
  item: string;
  userId: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: {
    entries: T[];
  };
  totalPages: number;
  totalItems: number;
}

export type User = {
  id: string;
  name: string;
  fullName: string;
  email: string;
  role: string;
};

export interface LoginResponse extends ApiResponse {
  content: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse extends ApiResponse {
  content: {
    user: User;
  };
}

export interface TodoParams {
  page?: number;
  rows?: number;
  search?: string;
  filter?: "all" | "done" | "undone";
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
