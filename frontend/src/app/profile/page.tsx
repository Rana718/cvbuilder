'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LinkedInMini from '@/components/LinkedInMini'
import {
    User,
    Mail,
    Calendar,
    LogOut,
    ArrowLeft,
    Edit,
    Save,
    X,
    Crown,
    Shield,
    Settings,
    Phone,
    MapPin,
    Globe
} from 'lucide-react'
import axiosInstance from '@/lib/axios'

interface UserProfile {
    id: number
    email: string
    full_name?: string
    created_at: string
    phone?: string
}

function ProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const { isAdmin, isSuperAdmin, loading: adminLoading } = useAdminAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        full_name: ''
    })

    useEffect(() => {
        if (authLoading) return

        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/profile'))
            return
        }

        fetchProfile()
    }, [user, authLoading, router])

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/profile')
            setProfile({
                id: response.data.id,
                email: response.data.email,
                full_name: response.data.full_name,
                phone: response.data.phone,
                created_at: user?.metadata?.creationTime || new Date().toISOString()
            })
            setEditForm({
                full_name: response.data.full_name || ''
            })
        } catch (error: any) {
            console.error('Failed to fetch profile:', error)
            if (error.response?.status === 401) {
                router.push('/sign-in?callbackUrl=' + encodeURIComponent('/profile'))
            } else {
                const mockProfile: UserProfile = {
                    id: 1,
                    email: user?.email || '',
                    full_name: user?.displayName || '',
                    created_at: user?.metadata?.creationTime || new Date().toISOString()
                }
                setProfile(mockProfile)
                setEditForm({
                    full_name: mockProfile.full_name || ''
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            if (profile) {
                setProfile({
                    ...profile,
                    full_name: editForm.full_name
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
                full_name: profile.full_name || ''
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
            month: 'short',
            day: 'numeric'
        })
    }

    if (authLoading || loading || adminLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative w-12 h-12 mx-auto mb-4">
                        <div className="absolute inset-0 border-3 border-slate-200 rounded-full"></div>
                        <div className="absolute inset-0 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-1">Loading Profile</h3>
                    <p className="text-sm text-slate-500">Please wait...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-slate-600">Failed to load profile</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Compact Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Dashboard</span>
                            </Link>
                            <div className="h-5 w-px bg-slate-300 hidden sm:block"></div>
                            <h1 className="text-xl sm:text-2xl font-medium text-slate-900">Profile Settings</h1>
                        </div>
                        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-lg font-medium text-slate-900">Profile Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Avatar and Name Section */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="relative flex-shrink-0">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                                            <User className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <div className="mb-3">
                                        <h3 className="text-2xl font-medium text-slate-900 truncate">
                                            {profile.full_name || 'User'}
                                        </h3>
                                        {(isAdmin || isSuperAdmin) && (
                                            <div className="inline-flex items-center space-x-1 mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                {isSuperAdmin ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                                <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center sm:justify-start space-x-2 text-slate-600">
                                            <Mail className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm truncate">{profile.email}</span>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start space-x-2 text-slate-500">
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm">Joined {formatDate(profile.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.full_name}
                                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-slate-800 text-sm">{profile.full_name || 'Not provided'}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <p className="text-slate-800 text-sm">{profile.email}</p>
                                        <p className="text-slate-500 text-xs mt-1">Email cannot be changed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LinkedIn Integration Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-slate-900 mb-4">LinkedIn Integration</h3>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                <LinkedInMini />
                            </div>
                        </div>
                    </div>

                    {/* Admin Panel Access */}
                    {(isAdmin || isSuperAdmin) && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div className="p-6">
                                <Link
                                    href="/admin"
                                    className="flex items-center justify-between p-4 text-purple-700 hover:text-white hover:bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl border-2 border-purple-200 hover:border-purple-600 transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-100 group-hover:bg-white/20 rounded-lg transition-colors">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Admin Panel</h4>
                                            <p className="text-sm text-purple-600 group-hover:text-purple-100">Manage application</p>
                                        </div>
                                    </div>
                                    {isSuperAdmin && (
                                        <Crown className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    )}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div className="p-6">
                                <h4 className="font-medium text-slate-900 mb-3">Account Security</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Password</span>
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">Change</button>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Two-Factor Auth</span>
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">Enable</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div className="p-6">
                                <h4 className="font-medium text-slate-900 mb-3">Privacy Settings</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Profile Visibility</span>
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">Public</button>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Data Export</span>
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sign Out Section */}
                    <div className="bg-white rounded-2xl border border-red-200 shadow-sm">
                        <div className="p-6">
                            <h4 className="font-medium text-slate-900 mb-3">Account Actions</h4>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleSignOut}
                                    className="inline-flex items-center justify-center space-x-2 px-4 py-3 text-red-700 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-xl transition-all font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                                <button className="inline-flex items-center justify-center space-x-2 px-4 py-3 text-red-700 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-xl transition-all font-medium">
                                    <X className="w-4 h-4" />
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage