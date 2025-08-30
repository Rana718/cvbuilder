'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
    User, 
    Mail, 
    Calendar, 
    FileText, 
    Settings, 
    LogOut, 
    ArrowLeft,
    Edit,
    Save,
    X
} from 'lucide-react'
import axiosInstance from '@/lib/axios'

interface UserProfile {
    id: number
    username: string
    email: string
    full_name?: string
    created_at: string
    updated_at: string
}

interface ProfileStats {
    totalResumes: number
    lastResumeCreated: string | null
}

function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState<ProfileStats>({ totalResumes: 0, lastResumeCreated: null })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        full_name: '',
        username: ''
    })

    useEffect(() => {
        if (status === 'loading') return
        
        if (!session) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/profile'))
            return
        }

        fetchProfile()
        fetchStats()
    }, [session, status])

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/profile')
            setProfile(response.data)
            setEditForm({
                full_name: response.data.full_name || '',
                username: response.data.username || ''
            })
        } catch (error: any) {
            console.error('Failed to fetch profile:', error)
            if (error.response?.status === 401) {
                router.push('/sign-in?callbackUrl=' + encodeURIComponent('/profile'))
            } else {
                // Fallback to session data if API fails
                const mockProfile: UserProfile = {
                    id: 1,
                    username: session?.user?.name || 'User',
                    email: session?.user?.email || '',
                    full_name: session?.user?.name || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
                setProfile(mockProfile)
                setEditForm({
                    full_name: mockProfile.full_name || '',
                    username: mockProfile.username || ''
                })
            }
        }
    }

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/api/resume-op/all')
            const resumes = response.data
            
            setStats({
                totalResumes: resumes.length,
                lastResumeCreated: resumes.length > 0 ? 
                    resumes.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at 
                    : null
            })
        } catch (error: any) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            // In a real app, you'd make an API call to update the profile
            // await axiosInstance.put('/api/auth/profile', editForm)
            
            // For now, just update local state
            if (profile) {
                setProfile({
                    ...profile,
                    full_name: editForm.full_name,
                    username: editForm.username,
                    updated_at: new Date().toISOString()
                })
            }
            setIsEditing(false)
        } catch (error: any) {
            console.error('Failed to update profile:', error)
            alert('Failed to update profile. Please try again.')
        }
    }

    const handleCancelEdit = () => {
        if (profile) {
            setEditForm({
                full_name: profile.full_name || '',
                username: profile.username || ''
            })
        }
        setIsEditing(false)
    }

    const handleSignOut = async () => {
        if (confirm('Are you sure you want to sign out?')) {
            await signOut({ callbackUrl: '/sign-in' })
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Failed to load profile</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/resusme"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Resumes</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300" />
                            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:text-green-700 border border-green-300 rounded-lg hover:bg-green-50"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Save</span>
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Avatar */}
                                    <div className="flex items-center space-x-4">
                                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {profile.full_name || profile.username}
                                            </h3>
                                            <p className="text-gray-600">{profile.email}</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.full_name}
                                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your full name"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{profile.full_name || 'Not provided'}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Username
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.username}
                                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your username"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{profile.username}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <p className="text-gray-900 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                {profile.email}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Member Since
                                            </label>
                                            <p className="text-gray-900 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                                {formatDate(profile.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="space-y-6">
                        {/* Resume Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Resume Statistics</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Total Resumes</span>
                                        <span className="text-2xl font-bold text-blue-600">{stats.totalResumes}</span>
                                    </div>
                                    {stats.lastResumeCreated && (
                                        <div>
                                            <span className="text-gray-600 text-sm">Last Resume Created</span>
                                            <p className="text-gray-900">{formatDate(stats.lastResumeCreated)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <Link
                                        href="/template"
                                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>Create New Resume</span>
                                    </Link>
                                    <Link
                                        href="/resusme"
                                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span>Manage Resumes</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage