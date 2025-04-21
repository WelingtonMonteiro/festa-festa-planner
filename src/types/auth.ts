
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}
