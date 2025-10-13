'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import axiosInstance from '@/lib/axios';

interface SubscriptionStatus {
    has_subscription: boolean;
    is_premium: boolean;
    is_active: boolean;
    status: string;
    current_period_end?: string;
    plan?: string;
    plan_name?: string;
    downloads_used?: number;
    download_limit?: number | null;
    can_download?: boolean;
}

interface PremiumStatus {
    isPremium: boolean;
    loading: boolean;
    subscriptionStatus?: SubscriptionStatus;
    refreshStatus: () => Promise<void>;
}

export const usePremiumStatus = (): PremiumStatus => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>();

    const checkPremiumStatus = async () => {
        if (!user) {
            setIsPremium(false);
            setSubscriptionStatus(undefined);
            setLoading(false);
            return;
        }

        try {
            // Get subscription status from backend (auto-checks expiration)
            const response = await axiosInstance.get('/api/payment/subscription-status');
            const data: SubscriptionStatus = response.data;
            
            setSubscriptionStatus(data);
            
            // User is premium only if:
            // 1. Has subscription
            // 2. is_premium is true
            // 3. is_active is true (not expired)
            const userIsPremium = data.has_subscription && data.is_premium && data.is_active;
            setIsPremium(userIsPremium);
            
            // Update Firebase token claims to match backend
            try {
                await user.getIdToken(true); // Force refresh token
            } catch (tokenError) {
                console.error('Failed to refresh token:', tokenError);
            }
            
        } catch (error: any) {
            console.error('Failed to check premium status:', error);
            
            // On error, assume not premium for safety
            setIsPremium(false);
            setSubscriptionStatus(undefined);
        } finally {
            setLoading(false);
        }
    };

    const refreshStatus = async () => {
        setLoading(true);
        await checkPremiumStatus();
    };

    useEffect(() => {
        checkPremiumStatus();
    }, [user]);

    return { 
        isPremium, 
        loading, 
        subscriptionStatus, 
        refreshStatus 
    };
};
