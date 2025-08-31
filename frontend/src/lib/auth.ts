import { auth } from './firebase';
import axiosInstance from './axios';
import { onAuthStateChanged, User } from 'firebase/auth';

// Sync Firebase user with backend
export const syncUserWithBackend = async (firebaseUser: User) => {
  try {
    // Get fresh token with claims
    const tokenResult = await firebaseUser.getIdTokenResult(true);
    
    // Check if user already exists in database
    if (tokenResult.claims.dbUser === "true") {
      return; // User already exists in database
    }

    // Extract user data from Firebase
    const userData = {
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      full_name: firebaseUser.displayName || '',
      image_url: firebaseUser.photoURL || '',
      google_id: firebaseUser.providerData.find(p => p.providerId === 'google.com')?.uid || null
    };

    // Add user to database
    const response = await axiosInstance.post('/api/auth/add-user', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to sync user with backend:', error);
    throw error;
  }
};

// Auth state listener
export const setupAuthListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await syncUserWithBackend(firebaseUser);
        callback(firebaseUser);
      } catch (error) {
        console.error('Backend sync failed:', error);
        callback(firebaseUser); // Still call callback with Firebase user
      }
    } else {
      callback(null);
    }
  });
};
