'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import axiosInstance from '@/lib/axios';

interface UserProfile {
    id: number;
    email: string;
    full_name: string;
    firebase_uid: string;
    image_url?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    created_at: string;
    last_login?: string;
}

interface UserProfileState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    isAdmin: boolean;
    isSuperAdmin: boolean;
}

export const useUserProfile = () => {
    const { user } = useAuth();
    const [state, setState] = useState<UserProfileState>({
        profile: null,
        loading: true,
        error: null,
        isAdmin: false,
        isSuperAdmin: false
    });

    const fetchUserProfile = async () => {
        if (!user) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'User not authenticated'
            }));
            return;
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            // Get user profile from backend
            const response = await axiosInstance.get('/api/auth/profile');

            // Also check Firebase claims for admin status
            const tokenResult = await user.getIdTokenResult(true);
            const claims = tokenResult.claims;

            const isAdmin = claims.admin === true || claims.admin === "true";
            const isSuperAdmin = claims.superAdmin === true || claims.superAdmin === "true";

            setState({
                profile: response.data,
                loading: false,
                error: null,
                isAdmin,
                isSuperAdmin
            });
        } catch (error: any) {
            console.error('Failed to fetch user profile:', error);
            setState({
                profile: null,
                loading: false,
                error: error.response?.data?.detail || 'Failed to fetch user profile',
                isAdmin: false,
                isSuperAdmin: false
            });
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [user]);

    return {
        ...state,
        refetch: fetchUserProfile
    };
};
