import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import type { PaymentManagementResponse } from '@/types/payment';

interface UsePaymentManagementReturn {
    data: PaymentManagementResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const usePaymentManagement = (): UsePaymentManagementReturn => {
    const [data, setData] = useState<PaymentManagementResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get('/api/admin/payments/payment-management');
            setData(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to fetch payment data');
            console.error('Error fetching payment management data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};
