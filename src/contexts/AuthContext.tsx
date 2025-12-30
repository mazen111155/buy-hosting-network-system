import React, { useState, useEffect, ReactNode } from 'react';
import auth from '@/lib/shared/kliv-auth.js';
import { AuthContext, User } from './authTypes';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await auth.getUser();
      setUser(currentUser);
    } catch (error) {
      console.log('Error refreshing user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.log('No authenticated user');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password);
    setUser(result);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signOut,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
