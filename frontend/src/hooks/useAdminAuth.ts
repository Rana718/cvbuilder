'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminAuthState {
    isAdmin: boolean;
    isSuperAdmin: boolean;
    loading: boolean;
    error: string | null;
}

export const useAdminAuth = () => {
    const { user, loading: authLoading } = useAuth();
    const [adminState, setAdminState] = useState<AdminAuthState>({
        isAdmin: false,
        isSuperAdmin: false,
        loading: true,
        error: null
    });
    const router = useRouter();

    const checkAdminStatus = async () => {
        if (authLoading) return; // Wait for auth to complete

        if (!user) {
            setAdminState({
                isAdmin: false,
                isSuperAdmin: false,
                loading: false,
                error: 'User not authenticated'
            });
            router.push('/sign-in');
            return;
        }

        try {
            // Get fresh token with claims - this is the only Firebase call needed
            const tokenResult = await user.getIdTokenResult(true);
            const claims = tokenResult.claims;

            const isAdmin = claims.isAdmin === true || claims.isAdmin === "true";
            const isSuperAdmin = claims.isSuperAdmin === true || claims.isSuperAdmin === "true";

            if (!isAdmin && !isSuperAdmin) {
                setAdminState({
                    isAdmin: false,
                    isSuperAdmin: false,
                    loading: false,
                    error: 'Admin access required'
                });
                router.push('/');
                return;
            }

            setAdminState({
                isAdmin,
                isSuperAdmin,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Failed to check admin status:', error);
            setAdminState({
                isAdmin: false,
                isSuperAdmin: false,
                loading: false,
                error: 'Failed to verify admin status'
            });
            router.push('/');
        }
    };

    const refreshAdminStatus = async () => {
        await checkAdminStatus();
    };

    useEffect(() => {
        checkAdminStatus();
    }, [user, authLoading, router]);

    return {
        ...adminState,
        refreshAdminStatus
    };
};
