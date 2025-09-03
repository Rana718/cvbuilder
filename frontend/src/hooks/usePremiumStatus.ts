'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import axiosInstance from '@/lib/axios';

interface SubscriptionStatus {
    has_subscription: boolean;
    is_premium: boolean;
    status: string;
    current_period_end?: string;
    plan?: string;
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
            const response = await axiosInstance.get('/api/payment/subscription-status');
            const data: SubscriptionStatus = response.data;
            setSubscriptionStatus(data);
            setIsPremium(data.is_premium);
        } catch (error: any) {
            console.error('Failed to check premium status:', error);
            
            // Fallback to token claims if API fails
            try {
                const tokenResult = await user.getIdTokenResult(true);
                const premium = tokenResult.claims.premium === "true" || tokenResult.claims.premium === true;
                setIsPremium(premium);
            } catch (tokenError) {
                console.error('Failed to get token claims:', tokenError);
                setIsPremium(false);
            }
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
