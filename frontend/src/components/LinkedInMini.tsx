'use client'

import React, { useState, useEffect } from 'react'
import axiosInstance from '@/lib/axios'
import { ExternalLink, Linkedin, Unlink, RefreshCw, CheckCircle } from 'lucide-react'

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

const LinkedInMini = () => {
    const [connectionStatus, setConnectionStatus] = useState<LinkedInConnectionStatus | null>(null)
    const [linkedinProfile, setLinkedinProfile] = useState<LinkedInProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)

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
        } catch (error) {
            console.error('Failed to disconnect LinkedIn:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                <span className="text-sm text-gray-500">Loading...</span>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Linkedin className="w-6 h-6 text-blue-600" />
                    {connectionStatus?.is_connected && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-2 h-2 text-white" />
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                    <p className="text-xs text-gray-500">
                        {connectionStatus?.is_connected ? 'Connected' : 'Not connected'}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {connectionStatus?.is_connected ? (
                    <>
                        {connectionStatus.profile_url && (
                            <a
                                href={connectionStatus.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                        <button
                            onClick={handleDisconnect}
                            className="text-red-600 hover:text-red-700 text-xs"
                            title="Disconnect LinkedIn"
                        >
                            <Unlink className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-md disabled:opacity-50"
                    >
                        {connecting ? 'Connecting...' : 'Connect'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default LinkedInMini
