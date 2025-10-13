import React from 'react'

export const LoadingSpinner: React.FC = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            </div>
            <p className="text-slate-700 font-medium">Loading your resume...</p>
        </div>
    </div>
)

export const EditorLoadingSpinner: React.FC = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            </div>
            <p className="text-slate-700 font-medium">Loading resume editor...</p>
        </div>
    </div>
)
