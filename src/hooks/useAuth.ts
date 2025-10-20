import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import type { RecordModel } from 'pocketbase';

export function useAuth() {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.model);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setUser(authData.record);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signOut,
  };
}
