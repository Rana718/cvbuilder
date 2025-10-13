'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { downloadsAPI, DownloadStatus } from '@/lib/api/downloads';

export const useDownloadStatus = () => {
    const { user } = useAuth();
    const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDownloadStatus = async () => {
        if (!user) {
            setDownloadStatus(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const status = await downloadsAPI.getDownloadStatus();
            setDownloadStatus(status);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch download status:', err);
            setError(err.response?.data?.detail || 'Failed to fetch download status');
            setDownloadStatus(null);
        } finally {
            setLoading(false);
        }
    };

    const trackDownload = async () => {
        if (!user) return false;

        try {
            const result = await downloadsAPI.trackDownload();
            // Refresh status after tracking
            await fetchDownloadStatus();
            return result;
        } catch (err: any) {
            console.error('Failed to track download:', err);
            throw new Error(err.response?.data?.detail || 'Failed to track download');
        }
    };

    useEffect(() => {
        fetchDownloadStatus();
    }, [user]);

    return {
        downloadStatus,
        loading,
        error,
        refetch: fetchDownloadStatus,
        trackDownload
    };
};
