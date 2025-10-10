import { User } from 'firebase/auth';
import axiosInstance from '@/lib/axios';

export interface PremiumStatusUpdate {
    isPremium: boolean;
    subscriptionStatus?: string;
    message?: string;
}

/**
 * Force refresh Firebase token and check premium status
 */
export const refreshPremiumStatus = async (user: User | null): Promise<PremiumStatusUpdate> => {
    if (!user) {
        return { isPremium: false };
    }

    try {
        // Force refresh Firebase token to get latest claims
        await user.getIdToken(true);
        
        // Check subscription status from API
        const response = await axiosInstance.get('/api/payment/subscription-status');
        const data = response.data;
        
        return {
            isPremium: data.is_premium,
            subscriptionStatus: data.status,
            message: 'Premium status updated successfully'
        };
    } catch (error) {
        console.error('Failed to refresh premium status:', error);
        
        // Fallback to token claims
        try {
            const tokenResult = await user.getIdTokenResult(true);
            const premium = tokenResult.claims.premium === "true" || tokenResult.claims.premium === true;
            
            return {
                isPremium: premium,
                message: 'Premium status retrieved from token claims'
            };
        } catch (tokenError) {
            console.error('Failed to get token claims:', tokenError);
            return { 
                isPremium: false,
                message: 'Failed to retrieve premium status'
            };
        }
    }
};

/**
 * Handle post-payment premium status update
 */
export const handlePostPaymentUpdate = async (user: User | null): Promise<PremiumStatusUpdate> => {
    if (!user) {
        return { isPremium: false };
    }

    // Wait a moment for backend to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return await refreshPremiumStatus(user);
};

/**
 * Check if user should see watermark
 */
export const shouldShowWatermark = (user: User | null, isPremium: boolean, pass?: boolean): boolean => {
    if (pass) return false;
    return !user || !isPremium;
};
