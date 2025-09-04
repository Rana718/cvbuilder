'use client';

import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminProtectedLayoutProps {
    children: React.ReactNode;
}

const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying admin access...</p>
        </div>
    </div>
);

const AccessDenied = ({ error }: { error: string }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <h2 className="text-lg font-bold mb-2">Access Denied</h2>
                <p>{error}</p>
            </div>
            <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Return to Home
            </a>
        </div>
    </div>
);

export default function AdminProtectedLayout({ children }: AdminProtectedLayoutProps) {
    const { isAdmin, isSuperAdmin, loading, error } = useAdminAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || (!isAdmin && !isSuperAdmin)) {
        return <AccessDenied error={error || 'Admin access required'} />;
    }

    return <>{children}</>;
}
