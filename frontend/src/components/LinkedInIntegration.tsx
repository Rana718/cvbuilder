'use client'

import React, { useState, useEffect } from 'react'
import axiosInstance from '@/lib/axios'
import { ExternalLink, Linkedin, Unlink, RefreshCw, Calendar } from 'lucide-react'

interface LinkedInProfile {
    id: number
    user_id: number
    linkedin_id: string
    profile_url?: string
    picture_url?: string
    headline?: string
    location?: string
    industry?: string
    summary?: string
    first_name?: string
    last_name?: string
    email_address?: string
    is_connected: boolean
    connected_at: string
    last_synced_at: string
    created_at: string
    updated_at: string
}

interface LinkedInConnectionStatus {
    is_connected: boolean
    connected_at?: string
    last_synced_at?: string
    profile_url?: string
    headline?: string
}

const LinkedInIntegration = () => {
    const [connectionStatus, setConnectionStatus] = useState<LinkedInConnectionStatus | null>(null)
    const [linkedinProfile, setLinkedinProfile] = useState<LinkedInProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)
    const [syncing, setSyncing] = useState(false)

    useEffect(() => {
        fetchConnectionStatus()
    }, [])

    const fetchConnectionStatus = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/api/linkedin/status')
            setConnectionStatus(response.data)
            
            if (response.data.is_connected) {
                fetchLinkedInProfile()
            }
        } catch (error: any) {
            console.error('Failed to fetch LinkedIn status:', error)
            // If it's an auth error, don't show LinkedIn integration
            if (error.response?.status === 401) {
                console.log('User not authenticated for LinkedIn integration')
                setConnectionStatus({ is_connected: false })
                return
            }
            // For other errors, still show the component but with error state
            setConnectionStatus({ is_connected: false })
        } finally {
            setLoading(false)
        }
    }

    const fetchLinkedInProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/linkedin/profile')
            setLinkedinProfile(response.data)
        } catch (error) {
            console.error('Failed to fetch LinkedIn profile:', error)
        }
    }

    const handleConnect = async () => {
        try {
            setConnecting(true)
            const response = await axiosInstance.get('/api/linkedin/connect-url')
            const { auth_url } = response.data
            
            // Open LinkedIn OAuth in a popup or redirect
            window.location.href = auth_url
        } catch (error) {
            console.error('Failed to get LinkedIn connect URL:', error)
        } finally {
            setConnecting(false)
        }
    }

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect your LinkedIn profile?')) {
            return
        }

        try {
            await axiosInstance.delete('/api/linkedin/disconnect')
            setConnectionStatus({ is_connected: false })
            setLinkedinProfile(null)
            alert('LinkedIn profile disconnected successfully')
        } catch (error) {
            console.error('Failed to disconnect LinkedIn:', error)
            alert('Failed to disconnect LinkedIn profile')
        }
    }

    const handleSync = async () => {
        try {
            setSyncing(true)
            await axiosInstance.post('/api/linkedin/sync')
            await fetchLinkedInProfile()
            alert('LinkedIn profile synced successfully')
        } catch (error) {
            console.error('Failed to sync LinkedIn profile:', error)
            alert('Failed to sync LinkedIn profile')
        } finally {
            setSyncing(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <Linkedin className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold">LinkedIn Integration</h3>
                </div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Linkedin className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold">LinkedIn Integration</h3>
                </div>
                
                {connectionStatus?.is_connected && (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                            <span>Sync</span>
                        </button>
                        <button
                            onClick={handleDisconnect}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                        >
                            <Unlink className="h-4 w-4" />
                            <span>Disconnect</span>
                        </button>
                    </div>
                )}
            </div>

            {!connectionStatus?.is_connected ? (
                <div className="text-center py-8">
                    <div className="mb-4">
                        <Linkedin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            Connect Your LinkedIn Profile
                        </h4>
                        <p className="text-gray-600 mb-6">
                            Import your professional information to quickly populate your resume
                        </p>
                    </div>
                    
                    <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Linkedin className="h-5 w-5" />
                        <span>{connecting ? 'Connecting...' : 'Connect LinkedIn'}</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {linkedinProfile && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start space-x-4">
                                {linkedinProfile.picture_url && (
                                    <img
                                        src={linkedinProfile.picture_url}
                                        alt="LinkedIn Profile"
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">
                                        {linkedinProfile.first_name} {linkedinProfile.last_name}
                                    </h4>
                                    {linkedinProfile.headline && (
                                        <p className="text-gray-600 mb-2">{linkedinProfile.headline}</p>
                                    )}
                                    {linkedinProfile.location && (
                                        <p className="text-sm text-gray-500 mb-2">{linkedinProfile.location}</p>
                                    )}
                                    {linkedinProfile.profile_url && (
                                        <a
                                            href={linkedinProfile.profile_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            <span>View LinkedIn Profile</span>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Connected: {formatDate(connectionStatus.connected_at!)}</span>
                        </div>
                        {connectionStatus.last_synced_at && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <RefreshCw className="h-4 w-4" />
                                <span>Last synced: {formatDate(connectionStatus.last_synced_at)}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <p className="text-green-800 text-sm">
                            ✓ Your LinkedIn profile is connected and ready to use for resume generation
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LinkedInIntegration
