'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
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
    X,
    Plus
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
    const { user, loading: authLoading } = useAuth()
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
        if (authLoading) return

        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/profile'))
            return
        }

        fetchProfile()
        fetchStats()
    }, [user, authLoading, router])

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
                // Fallback to Firebase user data if API fails
                const mockProfile: UserProfile = {
                    id: 1,
                    username: user?.displayName || 'User',
                    email: user?.email || '',
                    full_name: user?.displayName || '',
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
            try {
                await signOut(auth)
                router.push('/')
            } catch (error) {
                console.error('Sign out error:', error)
            }
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm">Loading profile...</p>
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
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/resusme"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">Back</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300" />
                            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl border border-gray-200">
                            {/* Profile Header */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Save</span>
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Avatar and Basic Info */}
                                <div className="flex items-center space-x-6">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                                            <User className="w-12 h-12 text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                            {profile.full_name || profile.username}
                                        </h3>
                                        <p className="text-gray-600 flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {profile.email}
                                        </p>
                                        <p className="text-gray-500 flex items-center mt-1">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Member since {formatDate(profile.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="p-6">
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="Enter your full name"
                                            />
                                        ) : (
                                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                                <p className="text-gray-900">{profile.full_name || 'Not provided'}</p>
                                            </div>
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="Enter your username"
                                            />
                                        ) : (
                                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                                <p className="text-gray-900">{profile.username}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-gray-900">{profile.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Updated
                                        </label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-gray-900">{formatDate(profile.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Resume Stats */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalResumes}</div>
                                        <div className="text-sm text-gray-600">Total Resumes</div>
                                    </div>
                                    {stats.lastResumeCreated && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600 mb-1">Last Resume</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatDate(stats.lastResumeCreated)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/template"
                                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                                            <Plus className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">Create Resume</span>
                                    </Link>
                                    <Link
                                        href="/resusme"
                                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                                    >
                                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                                        </div>
                                        <span className="font-medium">View Resumes</span>
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