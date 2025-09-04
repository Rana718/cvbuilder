'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LinkedInMini from '@/components/LinkedInMini'
import PaymentHistory from '@/components/PaymentHistory'
import {
    User,
    Mail,
    Calendar,
    FileText,
    LogOut,
    ArrowLeft,
    Edit,
    Save,
    X,
    Plus,
    Crown,
    Award,
    BarChart3,
    Clock,
    CreditCard
} from 'lucide-react'
import axiosInstance from '@/lib/axios'

// Premium Status Hook
interface SubscriptionStatus {
    has_subscription: boolean;
    is_premium: boolean;
    status: string;
    current_period_end?: string;
    plan?: string;
}

interface PremiumStatus {
    isPremium: boolean;
    loading: boolean;
    subscriptionStatus?: SubscriptionStatus;
    refreshStatus: () => Promise<void>;
}

const usePremiumStatus = (): PremiumStatus => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>();

    const checkPremiumStatus = async () => {
        if (!user) {
            setIsPremium(false);
            setSubscriptionStatus(undefined);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/api/payment/subscription-status');
            const data: SubscriptionStatus = response.data;
            setSubscriptionStatus(data);
            setIsPremium(data.is_premium);
        } catch (error: any) {
            console.error('Failed to check premium status:', error);

            // Fallback to token claims if API fails
            try {
                const tokenResult = await user.getIdTokenResult(true);
                const premium = tokenResult.claims.premium === "true" || tokenResult.claims.premium === true;
                setIsPremium(premium);
            } catch (tokenError) {
                console.error('Failed to get token claims:', tokenError);
                setIsPremium(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshStatus = async () => {
        setLoading(true);
        await checkPremiumStatus();
    };

    useEffect(() => {
        checkPremiumStatus();
    }, [user]);

    return {
        isPremium,
        loading,
        subscriptionStatus,
        refreshStatus
    };
};

interface UserProfile {
    id: number
    email: string
    full_name?: string
    created_at: string
}

interface ProfileStats {
    totalResumes: number
    lastResumeCreated: string | null
}

function ProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const { isPremium, loading: premiumLoading, subscriptionStatus, refreshStatus } = usePremiumStatus()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState<ProfileStats>({ totalResumes: 0, lastResumeCreated: null })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [showPaymentHistory, setShowPaymentHistory] = useState(false)
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
        fetchStats()
    }, [user, authLoading, router])

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/profile')
            setProfile({
                id: response.data.id,
                email: response.data.email,
                full_name: response.data.full_name,
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
                // Fallback to Firebase user data if API fails
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
            month: 'long',
            day: 'numeric'
        })
    }

    if (authLoading || loading || premiumLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
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
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/resusme"
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Back</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Main Profile Section */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Profile Header */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Avatar and Basic Info */}
                            <div className="flex items-start space-x-6 mb-6">
                                <div className="relative">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <User className="w-10 h-10 text-blue-600" />
                                        </div>
                                    )}
                                    {isPremium && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <Crown className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {profile.full_name || 'User'}
                                        </h3>
                                        {isPremium && (
                                            <div className="flex items-center space-x-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                <Award className="w-3 h-3" />
                                                <span>Premium</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 flex items-center mb-2">
                                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                        {profile.email}
                                    </p>
                                    <p className="text-gray-500 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                        Member since {formatDate(profile.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
                                        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-gray-900">{profile.full_name || 'Not provided'}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-900">{profile.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* LinkedIn Integration Mini */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <LinkedInMini />
                            </div>

                            {/* Sign Out Button */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>

                        {/* Payment History */}
                        {isPremium && (
                            <div className="bg-white border border-gray-200 rounded-lg">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
                                            Billing & Payments
                                        </h2>
                                        <button
                                            onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            {showPaymentHistory ? 'Hide' : 'Show'} Details
                                        </button>
                                    </div>
                                </div>
                                {showPaymentHistory && (
                                    <div className="p-6">
                                        <PaymentHistory onRefreshStatus={refreshStatus} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Status</h3>
                            <div className="text-center">
                                <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${isPremium
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                    }`}>
                                    {isPremium ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    <span>{isPremium ? 'Premium' : 'Free'}</span>
                                </div>
                                {subscriptionStatus?.current_period_end && (
                                    <p className="text-xs text-gray-600 mt-2">
                                        Valid until {formatDate(subscriptionStatus.current_period_end)}
                                    </p>
                                )}
                                {!isPremium && (
                                    <Link
                                        href="/pricing"
                                        className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                                    >
                                        Upgrade
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Resume Stats */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                                Statistics
                            </h3>
                            <div className="space-y-3">
                                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalResumes}</div>
                                    <div className="text-xs text-gray-600">Total Resumes</div>
                                </div>
                                {stats.lastResumeCreated && (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center text-xs text-gray-600 mb-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Last Resume
                                        </div>
                                        <div className="text-xs font-medium text-gray-900">
                                            {formatDate(stats.lastResumeCreated)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                                                {/* Quick Actions */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <Link
                                    href="/template"
                                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Resume</span>
                                </Link>
                                <Link
                                    href="/resusme"
                                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>My Resumes</span>
                                </Link>
                                {isPremium && (
                                    <button
                                        onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                                        className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        <span>Billing & Payments</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage