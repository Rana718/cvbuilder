'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';

interface PremiumStatus {
    isPremium: boolean;
    loading: boolean;
}

export const usePremiumStatus = (): PremiumStatus => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPremiumStatus = async () => {
            if (!user) {
                setIsPremium(false);
                setLoading(false);
                return;
            }

            try {
                // Get fresh token with claims
                const tokenResult = await user.getIdTokenResult(true);

                // Check if user has premium claim
                const premium = tokenResult.claims.premium === "true" || tokenResult.claims.premium === true;
                setIsPremium(premium);
            } catch (error) {
                console.error('Failed to check premium status:', error);
                setIsPremium(false);
            } finally {
                setLoading(false);
            }
        };

        checkPremiumStatus();
    }, [user]);

    return { isPremium, loading };
};
