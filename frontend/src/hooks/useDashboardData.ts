'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import axiosInstance from '@/lib/axios';

interface DashboardStats {
    total_users: number;
    user_growth_percentage: number;
    total_active_subscriptions: number;
    total_resumes: number;
    resume_growth_percentage: number;
    current_month_revenue: number;
    revenue_growth_percentage: number;
    recent_users: Array<{
        name: string;
        email: string;
        image_url?: string;
        registered_date: string;
        is_premium: boolean;
    }>;
    recent_payments: Array<{
        payment_id: string;
        user_name: string;
        user_email: string;
        amount: number;
        status: string;
        payment_date?: string;
    }>;
}

interface DashboardState {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
}

export const useDashboardData = () => {
    const { user } = useAuth();
    const [state, setState] = useState<DashboardState>({
        data: null,
        loading: true,
        error: null
    });

    const fetchDashboardData = async () => {
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

            const response = await axiosInstance.get('/api/admin/info/dashboard-info');

            setState({
                data: response.data,
                loading: false,
                error: null
            });
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            setState({
                data: null,
                loading: false,
                error: error.response?.data?.detail || 'Failed to fetch dashboard data'
            });
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    return {
        ...state,
        refetch: fetchDashboardData
    };
};
