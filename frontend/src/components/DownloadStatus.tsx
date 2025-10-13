'use client';

import React from 'react';
import { Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useDownloadStatus } from '@/hooks/useDownloadStatus';
import { motion } from 'framer-motion';

export default function DownloadStatus() {
    const { downloadStatus, loading, error } = useDownloadStatus();

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Download className="w-6 h-6 text-gray-400 animate-pulse" />
                    </div>
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded w-32 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !downloadStatus) {
        return (
            <div className="bg-white rounded-xl border border-red-200 p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Download Status</h3>
                        <p className="text-sm text-red-600">Unable to load download status</p>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusColor = () => {
        if (downloadStatus.plan_expired) return 'red';
        if (!downloadStatus.can_download) return 'orange';
        return 'green';
    };

    const getStatusIcon = () => {
        if (downloadStatus.plan_expired) return AlertCircle;
        if (!downloadStatus.can_download) return Clock;
        return CheckCircle;
    };

    const statusColor = getStatusColor();
    const StatusIcon = getStatusIcon();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-${statusColor}-100 rounded-xl flex items-center justify-center`}>
                        <StatusIcon className={`w-6 h-6 text-${statusColor}-500`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Download Status</h3>
                        <p className={`text-sm text-${statusColor}-600`}>{downloadStatus.message}</p>
                    </div>
                </div>
                
                {downloadStatus.download_limit && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            {downloadStatus.remaining_downloads || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                            of {downloadStatus.download_limit} left
                        </div>
                    </div>
                )}
                
                {!downloadStatus.download_limit && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">∞</div>
                        <div className="text-sm text-gray-500">Unlimited</div>
                    </div>
                )}
            </div>
            
            {downloadStatus.download_limit && (
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Used: {downloadStatus.downloads_used}</span>
                        <span>Limit: {downloadStatus.download_limit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full bg-${statusColor}-500 transition-all duration-300`}
                            style={{ 
                                width: `${(downloadStatus.downloads_used / downloadStatus.download_limit) * 100}%` 
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
