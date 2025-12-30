import { createContext } from 'react';

export interface User {
  userUuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  teamUuid?: string;
  isPrimaryTeam?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
