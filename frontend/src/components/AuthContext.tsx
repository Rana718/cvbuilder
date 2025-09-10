'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import axiosInstance from '@/lib/axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Sync user with backend silently
const syncUserWithBackend = async (firebaseUser: User) => {
  try {
    const tokenResult = await firebaseUser.getIdTokenResult(true);
    
    if (tokenResult.claims.dbUser === "true") {
      return;
    }

    const userData = {
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      full_name: firebaseUser.displayName || '',
      image_url: firebaseUser.photoURL || '',
      google_id: firebaseUser.providerData.find(p => p.providerId === 'google.com')?.uid || null
    };

    await axiosInstance.post('/api/auth/add-user', userData);
  } catch (error) {
    console.error('Failed to sync user with backend:', error);
  }
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        syncUserWithBackend(firebaseUser);
        setUser(firebaseUser);
      } else {
        setUser(null);
        localStorage.removeItem('profile_cache');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
