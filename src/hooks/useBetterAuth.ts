import { useState, useEffect } from 'react';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:3001',
});

export function useBetterAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setUser(session.data?.user || null);
        setIsAuthenticated(!!session.data?.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/dashboard',
      });
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  const signInWithGitHub = async () => {
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: window.location.origin + '/dashboard',
      });
    } catch (error) {
      console.error('GitHub sign in failed:', error);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
  };
}