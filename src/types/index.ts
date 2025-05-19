
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  userId: string;
  createdBy?: User;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
